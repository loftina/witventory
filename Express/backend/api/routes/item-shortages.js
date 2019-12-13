const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const ItemShortage = require('../models/item-damage');
const Item = require('../models/item');
const User = require('../models/user');

router.get('/:page', (req, res, next) => {

	const resPerPage = 6;
  	const page = req.params.page || 1;

	filter = req.query

	var regexFilter = function(filter){
		return_filter = {}
		Object.keys(filter).map(function(key){ return_filter[key] = filter[key] });
		return return_filter;
	}

	ItemShortage
		.find(regexFilter(filter))
		.sort({'createdAt': 'descending'})
		.skip((resPerPage * page) - resPerPage)
		.limit(resPerPage)
		.select('createdAt user item _id')
		.populate('item', 'name location _id')
		.populate('user', 'email _id')
		.exec()
		.then(item_shortages => {
			ItemShortage.countDocuments(regexFilter(filter), function (err, count) {
			    if (err) {
			      	res.status(500).json({
			          	error: err
			        });
			    } else {
			      	res.status(200).json({
						total_count: count,
            			total_pages: Math.ceil(count / resPerPage),
            			current_count: item_shortages.length,
            			current_page: parseInt(page),
						item_shortages: item_shortages.map(item_shortage => {
							return {
								_id: item_shortage._id,
								user: item_shortage.user,
								item: item_shortage.item,
								created: item_shortage.createdAt,
								request: {
									type: 'GET',
									url: process.env.API_URL + '/item_shortages/item_shortage/' + item_shortage._id
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
	Item.findById(req.body.item)
		.then(item => {
			console.log(item);
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

					const item_shortage = new ItemShortage({
						_id: mongoose.Types.ObjectId(),
						user: req.userData.id,
						item: req.body.item
					});

					return item_shortage.save();
				})
				.then(result => {
					res.status(201).json({
						message: 'item comment successfully created',
						createdItemShortage: {
							_id: result._id,
							user: result.user,
							item: result.item
						},
						request: {
							type: 'GET',
							url: process.env.API_URL + '/item_shortages/item_shortage/' + result._id
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

router.get('/item_shortage/:id', (req, res, next) => {
	ItemShortage.findById(req.params.id)
		.populate('item')
		.populate('user', 'email _id')
		.exec()
		.then(item_shortage => {
			if (!item_shortage) {
				return res.status(404).json({
					message: 'item_shortage not found'
				});
			}
			res.status(200).json({
				item_shortage: item_shortage,
				request: {
					type: 'GET',
					url: process.env.API_URL + '/item_shortages'
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
})

router.delete('/item_shortage/:id', checkAuth, (req, res, next) => {
	// can only delete if admin or owner of item_shortage
	if (!req.userData.admin){
		ItemShortage.findById(req.params.id)
			.then(item_shortage => {
				if (!item_shortage) {
					return res.status(404).json({
						message: 'item_shortage not found'
					});
				}
				else if (item_shortage.user != req.userData.id){
					return res.status(401).json({
						message: 'Auth failed'
					});
				} else {
					ItemShortage.deleteOne({ _id: req.params.id })
						.exec()
						.then(result => {
							res.status(200).json({
								message: 'Order successfully deleted',
								request: {
									type: 'GET',
									url: process.env.API_URL + '/item_shortages'
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
		ItemShortage.deleteOne({ _id: req.params.id })
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Order successfully deleted',
					request: {
						type: 'GET',
						url: process.env.API_URL + '/item_shortages'
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