const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Reservation = require('../models/reservation');
const Item = require('../models/item');
const User = require('../models/user');

router.get('/', (req, res, next) => {
	// filter for greater than start param and less than end param
	filter = req.query
	return_filter = {}
	if ((typeof filter.start != 'undefined') & (typeof filter.end != 'undefined')){
		return_filter.start_date = { $gte: filter.start, $lte: filter.end };
	}
	else if (typeof filter.start != 'undefined'){
		return_filter.start_date = { $gte: filter.start };
	}
	else if (typeof filter.end != 'undefined'){
		return_filter.start_date = { $lte: filter.end };
	}

	Reservation
		.find(return_filter)
		.select('user item start_date end_date _id')
		.populate('item', 'name location _id')
		.populate('user', 'email _id')
		.exec()
		.then(reservations => {
			res.status(200).json({
				count: reservations.length,
				reservations: reservations.map(reservation => {
					return {
						_id: reservation._id,
						user: reservation.user,
						item: reservation.item,
						start_date: reservation.start_date,
						end_date: reservation.end_date,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/reservations/' + reservation._id
						}
					}
				}),
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
			}
		})
		.catch(err => {
			res.status(500).json({
				error: err
			})
		});

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
							url: 'http://localhost:3000/reservations/' + result._id
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
});

router.get('/:id', (req, res, next) => {
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
					url: 'http://localhost:3000/reservations'
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
})

router.delete('/:id', checkAuth, (req, res, next) => {
	// can only delete if admin or owner of reservation
	if (!req.userData.admin){
		Reservation.findById(req.params.id)
			.then(reservation => {
				if (!reservation) {
					return res.status(404).json({
						message: 'Reservation not found'
					});
				}
				if (reservation.user != req.userData.id){
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			});
	}

	Reservation.deleteOne({ _id: req.params.id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Order successfully deleted',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/reservations'
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
})

module.exports = router;