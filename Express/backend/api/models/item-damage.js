const mongoose = require('mongoose');

const itemDamageSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }
},
{
	timestamps: true
});

module.exports = mongoose.model('ItemDamage', itemDamageSchema);