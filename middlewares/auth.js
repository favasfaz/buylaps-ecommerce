const jwt = require("jsonwebtoken");


const verifyUser = (req, res, next) => {
try {
  const token = req.cookies.token;
  if(!token) return res.status(403).send("Access deneid")

  const decoded =jwt.verify(token,'secret')
  req.user = decoded
  next()
} catch (error) {
  res.status(400).send('invalid token')
}   
  
};
const  verifyToken =(req,res,next)=>{
try {
  const token = req.cookies.token;
  if(!token){
    res.redirect('/users')
  }

  const decoded =jwt.verify(token,'secret')
  req.user = decoded
  next()
} catch (error) {
   res.status(400)

}
}
const sessionverify =(req,res,next)=>{
 
  if(req.session.loggedIn){
    res.redirect('/users')
  }else{
    next()

  }
}
const sessionverify2 =(req,res,next)=>{
 
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/users/login')
  }
}

const cartverify =(req,res,next)=>{
 let token= jwt.decode('token')
  if(token){
    next()
  }else{
    
    res.status({status:500})

  }
}
module.exports = {cartverify,verifyToken,verifyUser,sessionverify,sessionverify2};