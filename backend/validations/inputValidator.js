class Validator {
  constructor(k){
    this.errors = {}
  }

  isEmpty(obj) {
    if(obj){
      for(var key in obj) {
        if(obj.hasOwnProperty(key))
        return false;
      }
      return true;
    }else{
      return false;
    }
  } 

  // Checker Functions
  checkEmail(email){
    if(!email){
      this.errors.email = ["No email provided"];
      return;
    }
    if(email.length < 3){
      this.errors.email = ["Email is too short to be submitted"];      
      return;
    }
    var emailRegex =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(!emailRegex.test(email)){
      this.errors.email = ["Please enter a valid email"];          
      return;
    }
  }
  checkPassword(password){
    if(!password){
      this.errors.password = ["No password provided"];
      return;
    }
  }
  checkUsername(username){
    if(!username){
      this.errors.username = ["Please provide a valid username"]
      return;
    }    
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    if(!usernameRegex.test(username)){
      this.errors.username = ["Invalid username format. It should contain only letters and alphabets"];
      return;
    }
    if(username.length < 3){
      this.errors.username = ["Username should contain minimum of 3 characters"];
      return;
    }
    
  }  
  checkPasswordForRegister(password){
    if(!password){
      this.errors.password = ["Please provide a valid password"]
      return;
    }    
    if(password.length < 3){
      this.errors.password = ["Password should contain minimum of 3 characters"];
      return;
    }    
  }
  getUpdateUserFormat(data){
    let result = {};
    if(data.user && !this.isEmpty(data.user)){
      data = data.user;
      if(data.email){
        this.checkEmail(data.email);
        if(!this.errors.email){
          result.email = data.email;
        }
      }
      if(data.username){
        this.checkUsername(data.username);
        if(!this.errors.username){
          result.username = data.username;
        } 
      }
      if(data.password){
        this.checkPasswordForRegister(data.password);
        if(!this.errors.password){
          result.password = data.password;
        }
      }
      if(data.image){
        if(this.isEmpty(data.image)){
          this.errors.image = ["Please provide valid image information"];
        }
        else{
          result.image = data.image;
        }
      }
      if(data.bio){
        if(this.isEmpty(data.bio)){
          this.errors.bio = ["Please provide valid bio"];
        }else if(data.bio.length < 3 || data.bio.length > 150){
          this.errors.bio = ["Bio should be in between 3 and 150 characters"]
        }else{
          result.bio = data.bio;
        }
      }
      return result;
    }else{
      this.errors.user = ["Invalid data provided"]
    }
    return null;
  }

  // ERRORS
  appendError(key,value){
    this.errors[key] = [value]; 
  }
  serverError(res){
    return res.status(500).send({
      errors : {
        serverError : ["Sorry, there was something wrong on the server side"]
      }
    })
  }
  notFoundError(res){
    return res.status(404).send({
      errors : {
        notFound : ["Sorry, the request you are trying to make is not found on this server"]
      }
    })
  }
  unAuthorizedError(res){
    return res.status(401).send({
      errors : {
        unAuthorized : ["Unauthorized request"]
      }
    })
  }
  incorrectLoginError(res){
    return res.status(401).send({
      errors : {
        loginError : ["Incorrect email or password"]
      }
    })
  }
  getErrors(){
    return  this.errors;
  }
}

module.exports = Validator;
