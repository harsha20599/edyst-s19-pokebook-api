const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  _id : mongoose.Types.ObjectId,
  email : {
    type : String,
    required: true,
    unique : true
  },
  username : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true,
  },
  bio : String,
  image : String,
  following : [
    {type : Schema.Types.ObjectId, ref : 'User'}
  ],
  pokemons : [
    {type : Schema.Types.ObjectId, ref:'Pokemon'}
  ],
  favorites : [
    {type : Schema.Types.ObjectId, ref : 'Pokemon'}
  ]
});

module.exports = mongoose.model('User', userSchema);