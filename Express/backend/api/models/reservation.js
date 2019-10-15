const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
	start_date: { type: String, required: true },
	end_date: { type: String, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);