var express = require('express');
var router = express.Router();
 var Model = require('../Model/user-schema');
var {doSignup,userLogin,getAccount,forgotpass,otpVerify,newPass,settingPassword} = require('../Calls/userCalls')
var auth = require('../middlewares/auth')
var jwt = require('jsonwebtoken');
const { Router } = require('express');
/* GET users listing. */

// middlewares---------------------------------------------------------------
function authenticateToken(req, res, next) {
  
  // const token = authHeader && authHeader.split(' ')[1]

  const {token} = req.cookies;
  console.log(token)
  if (token == null) return res.sendStatus(401)

  jwt.verify(token,'secret', (err, user) => {

    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

// middlewareEnds-------------------------------------------------------------


router.get('/', function(req, res) {
   user = req.session.user
   user2 = req.session.user2
  console.log('lllllll');
  console.log(user);
  console.log('oooooooo');
 res.render('user/userhome',{user,user2});
});
router.get('/login', function(req, res) {
  res.render('user/login');
});
router.get('/register', function(req, res) {
  res.render('user/register',{'err':req.session.loggErr});
  req.session.loggErr=''
});
router.get('/signed',(req, res)=> {
  res.redirect('/');
});
router.post('/register',(req,res)=>{
doSignup(req.body).then((data)=>{
  console.log(data);
  req.session.loggedIn=true
  req.session.user=req.body
  res.cookie('token',data.token)
res.redirect('/users')
}).catch((err)=>{
req.session.loggErr=err.msg
res.redirect('/users/register')
})
})
router.post('/login',(req,res)=>{
userLogin(req.body).then(()=>{
  req.session.loggedIn=true
  req.session.user=req.body
  res.redirect('/users')
}).catch((err)=>{
  req.session.loggErr=err.msg
  res.render('user/login',{'err':req.session.loggErr})
})
})
router.get('/shop',(req,res)=>{
  res.render('user/shop')
})
router.get('/account/:id',(req,res)=>{
getAccount(req.params.id).then((data)=>{
  console.log(data);
  res.render('user/account',{data})

})
})
router.get('/cart',authenticateToken,(req,res)=>{
  // res.render('user/cart')
  try {
    res.render('user/cart')
  } catch (err) {
    res.render('user/login')
  }
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  req.cookies=null
  res.redirect('/users')
})
router.get('/forgot',(req,res)=>{
res.render('user/forgot',{user:req.session.email,err:req.session.forgotErr,Err1:req.session.otpErr})
req.session.forgotErr=''
})

router.post('/forgot',(req,res)=>{
  console.log(req.body);
  console.log('sharmaji');
forgotpass(req.body).then((data)=>{
  console.log(data.user.email);
  console.log(data.user.email);
  req.session.email=data.user.email
  res.redirect('/users/forgot')
}).catch((err)=>{
req.session.forgotErr=err.msg
console.log(req.session.forgotErr);
  res.redirect('/users/forgot')
})
  })

  router.get('/reset-password',(req,res)=>{
    res.render('user/reset-password',{user:req.session.email,Err:req.session.passErr})
  })
 
  router.post('/otp/:id',(req,res)=>{
    console.log(req.params.id);
    let id = req.params.id
      otpVerify(req.body,id).then((ans)=>{
          console.log(ans.msge);
          res.redirect('/users/reset-password')
        }).catch((err)=>{
          req.session.otpErr=err.msg
          console.log(req.session.otpErr);
        res.redirect('/users/forgot')
      })
  })
  
  router.post('/reset-password/:id',(req,res)=>{
    console.log('kkk');
  let id = req.params.id
    console.log(id);
    newPass(req.body,id).then(()=>{
      req.session.loggedIn=true
      req.session.user=req.params.id
      req.body=req.session.user
            res.redirect('/users')
    }).catch((err)=>{
      req.session.passErr=err.msg
      console.log(req.session.passErr);
     res.redirect('/users/reset-password')
    })
  })
  router.get('/passwordReset',(req,res)=>{
    res.render('user/passwordReset',{user:req.session.user,err:req.session.resetErr})
   req.session.resetErr=''
  })
  router.post('/passwordReset/:id',(req,res)=>{
    let id = req.params.id
    settingPassword(req.body,id).then(()=>{
      console.log('success');
        res.redirect('/users')
    }).catch((err)=>{
      console.log('err');
      req.session.resetErr=err.msg
      res.redirect('/users/passwordReset')
    })
  })

module.exports = router;
