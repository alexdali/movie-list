import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const User = mongoose.model('User', new mongoose.Schema({
  // _id: String,
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
}));

const List = mongoose.model('List', new mongoose.Schema({
  _id: ObjectId,
  title: String,
  numberOfItems: Number,
  userAverageRating: Number,
  description: String,
  items: [{ type: ObjectId, ref: 'item' }],
  userId: String,
  createdDate: { type: Date, default: Date.now },
}));

const Item = mongoose.model('Item', new mongoose.Schema({
  _id: ObjectId,
  lists: [{ type: ObjectId, ref: 'List' }],
  title: String,
  yearOfRelease: String,
  genre: String,
  plotShort: String,
  userRating: Number,
  comment: String,
  userId: String,
  createdDate: { type: Date, default: Date.now },
}));

// const Comment = mongoose.model('Comment', new mongoose.Schema({
//   _id: ObjectId,
//   userId: String,
//   content: String,
//   listId: String,
//   createdDate: { type: Date, default: Date.now },
// }));

export { User, List, Item };
