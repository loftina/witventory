const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const ItemComment = require('../models/item-comment');
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

	ItemComment
		.find(regexFilter(filter))
		.sort({'createdAt': 'descending'})
		.skip((resPerPage * page) - resPerPage)
		.limit(resPerPage)
		.select('createdAt comment user item _id')
		.populate('item', 'name location _id')
		.populate('user', 'email _id')
		.exec()
		.then(item_comments => {
			ItemComment.countDocuments(regexFilter(filter), function (err, count) {
			    if (err) {
			      	res.status(500).json({
			          	error: err
			        });
			    } else {
			      	res.status(200).json({
						total_count: count,
            			total_pages: Math.ceil(count / resPerPage),
            			current_count: item_comments.length,
            			current_page: parseInt(page),
						item_comments: item_comments.map(item_comment => {
							return {
								_id: item_comment._id,
								comment: item_comment.comment,
								user: item_comment.user,
								item: item_comment.item,
								created: item_comment.createdAt,
								request: {
									type: 'GET',
									url: process.env.API_URL + '/item_comments/item_comment/' + item_comment._id
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

					const item_comment = new ItemComment({
						_id: mongoose.Types.ObjectId(),
						comment: req.body.comment,
						user: req.userData.id,
						item: req.body.item
					});

					return item_comment.save();
				})
				.then(result => {
					res.status(201).json({
						message: 'item comment successfully created',
						createdItemComment: {
							_id: result._id,
							comment: result.comment,
							user: result.user,
							item: result.item
						},
						request: {
							type: 'GET',
							url: process.env.API_URL + '/item_comments/item_comment/' + result._id
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

router.get('/item_comment/:id', (req, res, next) => {
	ItemComment.findById(req.params.id)
		.populate('item', 'name location _id')
		.populate('user', 'email _id')
		.exec()
		.then(item_comment => {
			if (!item_comment) {
				return res.status(404).json({
					message: 'item_comment not found'
				});
			}
			res.status(200).json({
				item_comment: item_comment,
				request: {
					type: 'GET',
					url: process.env.API_URL + '/item_comments'
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
})

router.delete('/item_comment/:id', checkAuth, (req, res, next) => {
	// can only delete if admin or owner of item_comment
	if (!req.userData.admin){
		ItemComment.findById(req.params.id)
			.then(item_comment => {
				if (!item_comment) {
					return res.status(404).json({
						message: 'item_comment not found'
					});
				}
				else if (item_comment.user != req.userData.id){
					return res.status(401).json({
						message: 'Auth failed'
					});
				} else {
					ItemComment.deleteOne({ _id: req.params.id })
						.exec()
						.then(result => {
							res.status(200).json({
								message: 'Order successfully deleted',
								request: {
									type: 'GET',
									url: process.env.API_URL + '/item_comments'
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
		ItemComment.deleteOne({ _id: req.params.id })
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Order successfully deleted',
					request: {
						type: 'GET',
						url: process.env.API_URL + '/item_comments'
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