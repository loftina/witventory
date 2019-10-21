const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Reservation = require('../models/reservation');
const Item = require('../models/item');

router.get('/', (req, res, next) => {
	Reservation
		.find()
		.select('item start_date end_date _id')
		.populate('item', 'name location _id')
		.exec()
		.then(reservations => {
			res.status(200).json({
				count: reservations.length,
				reservations: reservations.map(reservation => {
					return {
						_id: reservation._id,
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
	Item.findById(req.body.item)
		.then(item => {
			if (!item) {
				return res.status(404).json({
					message: 'Item not found'
				});
			}
			const reservation = new Reservation({
				_id: mongoose.Types.ObjectId(),
				item: req.body.item,
				start_date: req.body.start_date,
				end_date: req.body.end_date
			});
			return reservation.save();
		})
		.then(result => {
			res.status(201).json({
				message: 'Reservation successfully created',
				createdOrder: {
					_id: result._id,
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
});

router.get('/:id', (req, res, next) => {
	Reservation.findById(req.params.id)
		.populate('item')
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