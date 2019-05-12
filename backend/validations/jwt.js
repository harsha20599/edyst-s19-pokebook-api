const jwt = require('jsonwebtoken');
const secretKey = "esoc19";

const createToken = (payload, expiresIn) =>{
  let token = jwt.sign(payload,secretKey, { expiresIn });
  return token;
}

const checkToken = (req,res,next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if( token && token.startsWith('Token ')){
    token = token.slice(6, token.length);
  }
  if(token){

    jwt.verify(token, secretKey, (err,decoded)=>{
      if(err){
        req.error = {
          id : 1,
          type : "Invalid token"
        };
        next();
      }else{
        req.decoded = decoded;
        next();
      }
    });
  }else{
    req.error = {
      id: 2,
      type : "No Auth key provided"
    };
    next();
  }
}


module.exports = {checkToken , createToken};