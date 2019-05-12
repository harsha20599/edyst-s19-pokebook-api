const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  _id : mongoose.Types.ObjectId,
  createdAt : {
    type : Date,
    default : Date.now()
  },
  body : String,
  createdBy : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }
});

module.exports = mongoose.model('Comment', commentSchema);