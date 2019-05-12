//TODO : 
// 1. Handle jwt errors from GET /api/user
// 2. Create patch api
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Validator = require("../validations/inputValidator");
const User = require("../models/user");
const JWT = require("../validations/jwt");

// POST api/users/login  PUBLIC
// Input -> username and password
// Output -> User object
router.post("/users/login", (req, res) => {
  let validator = new Validator();
  if( req.body.user && !validator.isEmpty(req.body.user)){
    validator.checkEmail(req.body.user.email);
    validator.checkPassword(req.body.user.password);
  }else{
    validator.appendError('user','Invalid data sent');
  }
  let errors = validator.getErrors();
  if (!validator.isEmpty(errors)) {
    return res.status(400).send(errors);
  }
  User.findOne({ email: req.body.user.email, password: req.body.user.password })
    .then(result => {
      if (
        !validator.isEmpty(result)
      ) {
        let userData = {
          user: {
            email: result.email,
            token: JWT.createToken(
              { id: result._id, email: result.email },
              "24h"
            ),
            username: result.username,
            bio: result.bio,
            image: result.image
          }
        };
        return res.send(userData);
      }
      return validator.notFoundError(res);
    })
    .catch(err => {
      validator.incorrectLoginError(res);
    });
});

//POST api/users  PUBLIC
// Input -> email, password and username
// Output -> User object
router.post("/users", (req, res) => {
  let validator = new Validator();
  if( req.body.user && !validator.isEmpty( req.body.user)){
    validator.checkEmail(req.body.user.email);
    validator.checkPasswordForRegister(req.body.user.password);
    validator.checkUsername(req.body.user.username);
  }else{
    validator.appendError('user',"Invalid data sent");
  }
  let errors = validator.getErrors();
  if (!validator.isEmpty(errors)) {
    return res.status(400).send(errors);
  }
  // Checking for exists of username
  User.findOne({ username: req.body.user.username })
    .then(user => {
      if (user && !validator.isEmpty(user)) {
        validator.appendError("username", "Username already exists");
      }
      // Checking for existence of email
      User.findOne({ email: req.body.user.email }).then(u => {
        if (u &&!validator.isEmpty(u)) {
          validator.appendError("email", "Email already exists");
        }
        errors = validator.getErrors();
        if (!validator.isEmpty(errors)) {
          return res.status(400).send({errors : errors});
        }
        // Creating user
        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.user.email,
          username: req.body.user.username,
          password: req.body.user.password,
          image: null,
          bio : ''
        });
        
        user
          .save()
          .then(result => {
            console.log(result);
            let token = JWT.createToken(
              { id: result._id, username: result.username },
              "24h"
            );
            let userData = {
              user: {
                email: result.email,
                token,
                username: result.username,
                bio: result.bio,
                image: result.image
              }
            };
            res.send(userData);
          })
          .catch(err => {
            validator.serverError(res);
          });
        });
      })
      .catch(err => {
      validator.serverError(res);
    });
});

// GET api/user PRIVATE
// Input -> (auth token)
// Output -> User Object
router.get("/user", JWT.checkToken, (req, res) => {
  let validator = new Validator();
  if(req.decoded){
    console.log(req.decoded)
    User.findById(req.decoded.id)
    .then(user => {
      if (
        user && !validator.isEmpty(user)
      ) {
        let userData = {
          user: {
            email: user.email,
            token: JWT.createToken(
              { id: user.id, email: user.email },
              "24h"
            ),
            username: user.username,
            bio: user.bio,
            image: user.image
          }
        };
        return res.send(userData);
      }
      return validator.notFoundError(res);
    })
    .catch(err => {
      validator.unAuthorizedError(res);
    });
  }else{
    validator.unAuthorizedError(res);
  }
});

//PATCH api/user
// Input -> to-be-updated user object
// Output -> Use Object
router.patch('/user',JWT.checkToken,(req,res)=>{
  let validator =  new Validator();
  let updateData = validator.getUpdateUserFormat(req.body);
  let errors = validator.getErrors();
  if(errors && !validator.isEmpty(errors)){
    return res.status(400).send(errors);
  }
  if(!req.decoded){
    return validator.unAuthorizedError(res);
  }
  User.findById(req.decoded.id).then(
    user => {
      // Checking for username and optional email
      if(updateData.username){
        User.findOne({username : updateData.username}).then(u => {
          if(u){
            validator.appendError('username','username already exists');      
          }
          if(updateData.email){
            User.findOne({email : updateData.email}).then(u2=>{
              // update statements
            })
          }else{
            // Update statements
          }
        })
      }        
    }
  )


})

router.get("/users", (req, res) => {
  User.find({})
    .then(user => {
      console.log(user);
      res.send(user);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
