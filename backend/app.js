const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL_MONGO,{useNewUrlParser : true}).then(()=>{
  console.log("connected");
});


app.use('/api', userRoutes);

app.listen(8006, ()=>{
  console.log("Listening on port 8006");
});