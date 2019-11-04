const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


const User = require('../models/user');

router.post('/signup', (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(422).json({
					message: 'Email already exists'
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err
						});
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							admin: "false"
						});
						user
						.save()
						.then(result => {
							console.log(result)
							res.status(201).json({
								message: 'user created'
							});
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
					}
				});
			}
		});
});

router.post('/login', (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email: user[0].email,
							id: user[0]._id,
							admin: user[0].admin
						},
						"secret", //CHANGE TO ENV VAR
						{
							expiresIn: "1h"
						}
					);
					return res.status(200).json({
						message: 'Auth successful',
						token: token,
						admin: user[0].admin,
						id: user[0]._id,
						expiration: Math.floor(Date.now() / 1000) + (60 * 60)
					});
				}
				return res.status(401).json({
					message: 'Auth failed'
				});

			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		})
})

router.delete('/:id', checkAuth, (req, res, next) => {
	if (!req.userData.admin) {
		return res.status(401).json({
			message: 'Auth failed'
		});
    }
	User.remove({ _id: req.params.id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "user deleted"
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});

});

module.exports = router;