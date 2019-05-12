const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pokemonSchema = mongoose.Schema({
  _id : mongoose.Types.ObjectId,
  name : {
    required : true,
    type : String
  },
  sprite : String,
  description : String,
  tags : [String],
  createdAt : {
    type : Date,
    default : Date.now()
  },
  updatedAt : {
    type : Date,
    default : Date.now()
  },
  favouritesCount : Number,
  favoritedBy : [
    {type : Schema.Types.ObjectId, ref : 'User'}
  ],
  trainerId : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }
});

module.exports = mongoose.model('Pokemon', pokemonSchema);