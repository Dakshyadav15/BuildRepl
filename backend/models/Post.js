import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  name: { type: String }, // User's name
  title: { type: String, required: true }, // ADD THIS LINE
  text: { type: String, required: true },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('post', PostSchema);
