const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const passwordValidator = require('password-validator');

const User = require('../models/user');

var password_schema = new passwordValidator();
password_schema
	.is().min(8)                                    // Minimum length 8
	.is().max(100)                                  // Maximum length 100
	.has().uppercase()                              // Must have uppercase letters
	.has().lowercase()                              // Must have lowercase letters
	.has().digits()                                 // Must have digits
	.has().not().spaces();                          // Cannot have spaces


/_ GET all users. _/
router.get('/:page', checkAuth, (req, res, next) => {

  if (!req.userData.admin) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }

  const resPerPage = 6;
  const page = req.params.page || 1;

  filter = req.query

  fields = "email admin _id"
  if (typeof filter.fields != 'undefined'){
    fields = filter.fields;
    delete filter.fields;
  }


  var regexFilter = function(filter){
    return_filter = {}
    Object.keys(filter).map(function(key){ return_filter[key] =  new RegExp('.*'+filter[key]+'.*', "i")});
    if (typeof filter.damaged_status != 'undefined'){
      return_filter['damaged_status'] = filter.damaged_status;
    }
    return return_filter;
  }

  User.find(regexFilter(filter))
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .select(fields)
    .exec()
    .then(users => {
      User.countDocuments(regexFilter(filter), function (err, count) {
        if (err) {
          res.status(500).json({
              error: err
            });
        } else {
          const response = {
            total_count: count,
            total_pages: Math.ceil(count / resPerPage),
            current_count: users.length,
            current_page: parseInt(page),
            users: users.map(user => {
              return {
                email: user.email,
                admin: user.admin,
                _id: user._id,
                request: {
                  type: 'GET',
                  description: 'get user details',
                  url: process.env.API_URL + '/users/user/' + user._id 
                }
              }
            })
          }
          res.status(200).json(response);
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

/_ GET one user. _/
router.get('/user/:id', checkAuth, (req, res, next) => {

	if (!req.userData.admin) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}

    filter = req.query

    fields = "email admin _id"
    if (typeof filter.fields != 'undefined'){
      fields = filter.fields;
    }

    User.findById(req.params.id)
      .select(fields)
      .exec()
      .then(user => {
        if (user) {
          res.status(200).json({
            email: user.email,
            admin: user.admin,
            request: {
              type: 'GET',
              description: 'get all users',
              url: process.env.API_URL + '/users/1'
            }
          })
        } else {
          res.status(404).json({
            message: "user not found"
          });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
});

router.post('/signup', (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(422).json({
					message: 'Email already exists'
				});
			}
			else if (!password_schema.validate(req.body.password)) {                        // Should not have spaces
				return res.status(401).json({
					message: 'Insecure password. Must be 8-100 characters with uppercase, lowercase, and digits with no spaces.'
				});
			}
			else {
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
		})
		.catch(err => {
	      res.status(500).json({
	        error: err
	      });
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

router.delete('/user/:id', checkAuth, (req, res, next) => {
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