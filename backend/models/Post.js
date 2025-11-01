const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: { type: String }, // User's name
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model('post', PostSchema);