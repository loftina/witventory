const mongoose = require('mongoose');

const itemCommentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	comment: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }
},
{
	timestamps: true
});

module.exports = mongoose.model('ItemComment', itemCommentSchema);