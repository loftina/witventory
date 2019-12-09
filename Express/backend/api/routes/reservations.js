const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Reservation = require('../models/reservation');
const Item = require('../models/item');
const User = require('../models/user');

router.get('/:page', (req, res, next) => {
	// filter for greater than start param and less than end param

	const resPerPage = 9;
  	const page = req.params.page || 1;


	filter = req.query
	temp_filter = {}
	if ((typeof filter.start != 'undefined') & (typeof filter.end != 'undefined')){
		temp_filter.start_date = { $gte: filter.start, $lte: filter.end };
		delete filter.start;
		delete filter.end;
	}
	else if (typeof filter.start != 'undefined'){
		temp_filter.start_date = { $gte: filter.start };
		delete filter.start;
	}
	else if (typeof filter.end != 'undefined'){
		temp_filter.start_date = { $lte: filter.end };
		delete filter.end;
	}

	var regexFilter = function(filter){
		return_filter = temp_filter
		Object.keys(filter).map(function(key){ return_filter[key] = filter[key]});
		return return_filter;
	}

	Reservation
		.find(regexFilter(filter))
		.sort({'createdAt': 'descending'})
		.skip((resPerPage * page) - resPerPage)
		.limit(resPerPage)
		.select('createdAt user item start_date end_date _id')
		.populate('item', 'image name location _id')
		.populate('user', 'email _id')
		.exec()
		.then(reservations => {
			Reservation.countDocuments(regexFilter(filter), function (err, count) {
			    if (err) {
			      	res.status(500).json({
			          	error: err
			        });
			    } else {
			      	res.status(200).json({
						total_count: count,
            			total_pages: Math.ceil(count / resPerPage),
            			current_count: reservations.length,
            			current_page: parseInt(page),
						reservations: reservations.map(reservation => {
							return {
								_id: reservation._id,
								user: reservation.user,
								item: reservation.item,
								start_date: reservation.start_date,
								end_date: reservation.end_date,
								created: reservation.createdAt,
								request: {
									type: 'GET',
									url: process.env.API_URL + '/reservations/' + reservation._id
								}
							}
						}),
					});
			    }
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		});
});

router.post('/', checkAuth, (req, res, next) => {
	// checking if item is already reserved
	Reservation
		.find({
			item: req.body.item,
			start_date: { $lt: req.body.end_date },
			end_date: { $gt: req.body.start_date }
		})
		.then(reservations => {
			if (reservations.length > 0) {
				return res.status(409).json({
					message: 'Item already reserved for this period'
				});
			} else {
				Item.findById(req.body.item)
					.then(item => {
						if (!item) {
							return res.status(404).json({
								message: 'Item not found'
							});
						}
						User.findById(req.userData.id)
							.then(user => {
								if (!user) {
									return res.status(404).json({
										message: 'Contact not found'
									});
								}

								const reservation = new Reservation({
									_id: mongoose.Types.ObjectId(),
									user: req.userData.id,
									item: req.body.item,
									start_date: req.body.start_date,
									end_date: req.body.end_date
								});

								return reservation.save();
							})
							.then(result => {
								res.status(201).json({
									message: 'Reservation successfully created',
									createdReservation: {
										_id: result._id,
										user: result.user,
										item: result.item,
										start_date: result.start_date,
										end_date: result.end_date
									},
									request: {
										type: 'GET',
										url: process.env.API_URL + '/reservations/' + result._id
									}
								})
							})
							.catch(err => {
								res.status(500).json({
									error: err
								})
							});
					})
					.catch(err => {
						res.status(500).json({
							error: err
						})
					});
			}
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		});
});

router.get('/reservation/:id', (req, res, next) => {
	Reservation.findById(req.params.id)
		.populate('item')
		.populate('user')
		.exec()
		.then(reservation => {
			if (!reservation) {
				return res.status(404).json({
					message: 'Reservation not found'
				});
			}
			res.status(200).json({
				reservation: reservation,
				request: {
					type: 'GET',
					url: process.env.API_URL + '/reservations'
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
})

router.delete('/reservation/:id', checkAuth, (req, res, next) => {
	// can only delete if admin or owner of reservation
	if (!req.userData.admin){
		Reservation.findById(req.params.id)
			.then(reservation => {
				if (!reservation) {
					return res.status(404).json({
						message: 'Reservation not found'
					});
				}
				else if (reservation.user != req.userData.id){
					return res.status(401).json({
						message: 'Auth failed'
					});
				} else {
					Reservation.deleteOne({ _id: req.params.id })
						.exec()
						.then(result => {
							res.status(200).json({
								message: 'Order successfully deleted',
								request: {
									type: 'GET',
									url: process.env.API_URL + '/reservations'
								}
							});
						})
						.catch(err => {
							res.status(500).json({
								error: err
							});
						});
				}
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			});
	} else {
		Reservation.deleteOne({ _id: req.params.id })
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Order successfully deleted',
					request: {
						type: 'GET',
						url: process.env.API_URL + '/reservations'
					}
				});
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			});
	}
})

module.exports = router;