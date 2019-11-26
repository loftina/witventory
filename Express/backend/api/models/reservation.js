const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
	start_date: { type: Date, required: true },
	end_date: { type: Date, required: true }
},
{
	timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);