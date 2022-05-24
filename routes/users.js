var express = require('express');
var router = express.Router();
 var Model = require('../Model/user-schema');
var {deleteCart,decProduct,getCartCount,productDetail,getCartItems,  addingToCart, doSignup,userLogin,getAccount,forgotpass,otpVerify,newPass,settingPassword,registeringUser,reSend} = require('../Calls/userCalls')
var auth = require('../middlewares/auth')
var jwt = require('jsonwebtoken');
const { Router } = require('express');
var {verifyToken,verifyUser,sessionverify,sessionverify2} = require('../middlewares/auth');
const { productDetails } = require('../Calls/adminCalls');
const async = require('hbs/lib/async');

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
   let count = null
   productDetail().then(async(product)=>{
     if(req.session.user){
     await getCartCount(req.session.user).then((count)=>{
        res.render('user/userhome',{user,product,count})
      })
     }else{
      res.render('user/userhome',{user,product});
     }
    }).catch((err)=>{
      productDetail().then(async(product)=>{
        res.render('user/userhome',{user,product});
      }) 
   })
});
router.get('/otp',sessionverify,(req,res)=>{
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0,post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
  user =req.session.user
  res.render('user/otp',{user,Err:req.session.otpErr})
  req.session.otpErr=''
})
router.get('/login', sessionverify, function(req, res) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
  res.render('user/login',{'err':req.session.loggErr});
  req.session.loggErr=''
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
  // req.session.loggedIn=true
 req.session.user=req.body
  // req.session.user=data
res.redirect('/users/otp')
}).catch((err)=>{
req.session.loggErr=err.msg
res.redirect('/users/register')
})
})
router.post('/otp',sessionverify,(req,res)=>{
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
 registeringUser(req.session.user,req.body).then((data)=>{
   req.session.loggedIn=true
  res.cookie('token',data.token,{httpOnly:true})
  res.redirect('/users')
 }).catch((err)=>{
   req.session.otpErr=err.msg
   res.redirect('/users/otp')
 })
})
router.post('/login',sessionverify,(req,res)=>{
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
userLogin(req.body).then(()=>{
  console.log('opppppppppppp');
  req.session.loggedIn=true
  req.session.user=req.body
  res.redirect('/users')
}).catch((err)=>{
  req.session.loggErr=err.msg
  res.redirect('/users/login')
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

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.clearCookie('token')
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
    req.session.passErr=''
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
  // let id = req.params.id
  let email =req.params.id
    newPass(req.body,email).then((data)=>{
      req.session.loggedIn=true
      req.session.user=data
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

  router.get('/wishlist',verifyToken,(req,res)=>{
    res.render('user/wishlist')
  })
  
  router.get('/reSend/:id',(req,res)=>{
    let id =req.params.id
    reSend(id).then(()=>{
      res.redirect('/users/otp')
    })
  })
  // -.------------------------------------------------ewr-------------------------------
  

  router.get('/add-to-cart/:id',(req,res)=>{
    let id = req.params.id
    addingToCart(id,req.session.user).then(()=>{
      getCartCount(req.session.user).then((count)=>{
        res.json({status:true,count})
      })
     // res.redirect('/users')
    })
  })
  router.get('/cart',sessionverify2,async(req,res)=>{
     let data=await getCartItems(req.session.user)
      let count = await getCartCount(req.session.user)
        if(data && count){
          let product=data.product 
       res.render('user/cart',{product,count})
        }else{
          res.render('user/cart')
        }
  })
  router.get('/productZoom/:id',(req,res)=>{
    let id =req.params.id
    console.log(id);
    productDetails(id).then((data)=>{
      res.render('user/productZoom',{data})
   })
  })
  router.post('/decProduct/:id',(req,res)=>{
    let id=req.params.id
    console.log('llllllllllllllll');
    console.log(id);
    decProduct(id,req.session.user).then(()=>{
      res.json({status:true})
    })
  })
  router.get('/delete-cart/:id',(req,res)=>{
    console.log(req.params.id);
    deleteCart(req.params.id,req.session.user).then(()=>{
      res.json({status:true})
    //  res.redirect('/users/cart')
    })
  })

module.exports = router;


