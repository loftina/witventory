const mongoose = require('mongoose');

// create item mongoose schema
const itemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  damaged_status: { type: Boolean, required: true },
  notes: { type: String, required: false },
  image: { type: String, required: false }
},
{
	timestamps: true
});

// export item model
module.exports = mongoose.model('Item', itemSchema);
