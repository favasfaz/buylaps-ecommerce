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

module.exports = {verifyToken,verifyUser,sessionverify};