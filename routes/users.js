var express = require('express');
var router = express.Router();
var easyinvoice = require('easyinvoice')
 var Model = require('../Model/user-schema');
var {deleteAddress,productReview,paymentFailed,searchFilter,addProfileImg,deleteOrder,getSingleProduct,checkStock,sortOrder,cancelOrder,addProfile,viewOrder,search,priceFilter,verifyPayment,generateRazor,placeOrder,findAddress,addAddress,getAddress,cartIn,findBrand,findDiscount,findCategory,getCategory,deleteWishlist,getWishlistCount,getAllWishlist,addToWishList,getCoupon,checkCoupon,getBrand,getfunction,subTotal,firstTwo,totalAmount,addProductCount,deleteCart,decProduct,getCartCount,productDetail,getCartItems,  addingToCart, doSignup,userLogin,getAccount,forgotpass,otpVerify,newPass,settingPassword,registeringUser,reSend} = require('../Calls/userCalls')
var auth = require('../middlewares/auth')
var jwt = require('jsonwebtoken');
var {cartverify,verifyToken,sessionverify,sessionverify2} = require('../middlewares/auth');
const { productDetails } = require('../Calls/adminCalls');
const async = require('hbs/lib/async');
const res = require('express/lib/response');
const Address = require('../Model/address-schema');
const Cart = require("../Model/cart-schema");
const PDFDocument = require('pdfkit');
var fs = require('fs');
const Order = require('../Model/order-schema')
const Product = require('../Model/product-schema');
var storage = require('../uploadMiddleware/multer');
const { log } = require('console');
const { response } = require('../app');

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
let filterResult

router.get('/', function(req, res) {
  console.log('success');
   user = req.session.user
   let count = null
   productDetail().then(async(product)=>{
    let firsttwo=await firstTwo()
    let brands =await getBrand()
    let category = await getCategory()
     if(req.session.user){
     await getCartCount(req.session.user).then(async(count)=>{
      let wishlistCount = await getWishlistCount(req.session.user)
        res.render('user/userhome',{user,wishlistCount,product,count,firsttwo,brands,category})
      })
     }else{
      res.render('user/userhome',{user,product,firsttwo,brands,category});
     }
    }).catch((err)=>{
      productDetail().then(async(product)=>{
        res.render('user/userhome',{user,product,firsttwo,brands,category});
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
 req.session.otp=data.otpCode
  // req.session.user=data
res.redirect('/otp')
}).catch((err)=>{
req.session.loggErr=err.msg
res.redirect('/register')
})
})
router.post('/otp',sessionverify,(req,res)=>{
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
 registeringUser(req.session.user,req.body,req.session.otp).then((data)=>{
   req.session.loggedIn=true
  res.cookie('token',data.token,{httpOnly:true})
  res.redirect('/')
 }).catch((err)=>{
   req.session.otpErr=err.msg
   res.redirect('/otp')
 })
})
router.post('/login',sessionverify,(req,res)=>{
  console.log('login');
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
userLogin(req.body).then(()=>{
  
  req.session.loggedIn=true
  req.session.user=req.body
  res.redirect('/')
}).catch((err)=>{
  req.session.loggErr=err.msg
  res.redirect('/login')
})
})
router.get('/shop',(req,res)=>{
  res.render('user/shop')
})
router.get('/account/:id',sessionverify2, async(req,res)=>{
 getAccount(req.params.id).then((data)=>{ 
   if(data){
     console.log(data,'data');
    res.render('user/account',{data})
   }else{
    res.render('user/account')

   } 

}).catch((err)=>{
  console.log(err,'err');
  res.redirect('/account')
})
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.clearCookie('token')
  res.redirect('/')
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
  res.redirect('/forgot')
}).catch((err)=>{
req.session.forgotErr=err.msg
console.log(req.session.forgotErr);
  res.redirect('/forgot')
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
          res.redirect('/reset-password')
        }).catch((err)=>{
          req.session.otpErr=err.msg
          console.log(req.session.otpErr);
        res.redirect('/forgot')
      })
  })
  
  router.post('/reset-password/:id',(req,res)=>{
  // let id = req.params.id
  let email =req.params.id
    newPass(req.body,email).then((data)=>{
      req.session.loggedIn=true
      req.session.user=data
            res.redirect('/')
    }).catch((err)=>{
      req.session.passErr=err.msg
      console.log(req.session.passErr);
     res.redirect('/reset-password')
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
        res.redirect('/')
    }).catch((err)=>{
      console.log('err');
      req.session.resetErr=err.msg
      res.redirect('/passwordReset')
    })
  })

 
  
  router.get('/reSend/:id',(req,res)=>{
    let id =req.params.id
    reSend(id).then((data)=>{
      req.session.otp=data.otpCode
      res.redirect('/otp')
    })
  })
  // -.------------------------------------------------ewr-------------------------------
  

  router.get('/add-to-cart/:id',sessionverify2,(req,res)=>{
    let id = req.params.id
    console.log(id);
    addingToCart(id,req.session.user).then(()=>{
      getCartCount(req.session.user).then((count)=>{
        res.json({status:true,count})
      })
     // res.redirect('/usgetAddressers')
    })
  })
  router.get('/cart',sessionverify2,async(req,res)=>{
    let user = req.session.user
    let total = await totalAmount(req.session.user)
    let dicounts=await findDiscount(req.session.user)
    let subtotal=await subTotal(req.session.user)
     let data=await getCartItems(req.session.user)
      let count = await getCartCount(req.session.user)
      let wishlistCount=await getWishlistCount(req.session.user)

    
        if(data && count){
          let product=data.product 
          // let grandTotal =(data.total-data.discount)+data.shippingCost
       res.render('user/cart',{user,wishlistCount,data,product,count,total,err:req.session.redeemErr})
        }else{
          res.render('user/cart',{wishlistCount})
        }
  })
  router.get('/productZoom/:id',async(req,res)=>{
    if(req.session.user){
    let count = await getCartCount(req.session.user)
    let wishlistCount=await getWishlistCount(req.session.user)
    let user= req.session.user
    let id =req.params.id
    productDetails(id).then((data)=>{
      console.log(data,'datas');
      res.render('user/productZoom',{data,user,count,wishlistCount})
   })
  }else{
    let id =req.params.id
    productDetails(id).then((data)=>{
      console.log(data,'datas');
      res.render('user/productZoom',{data})
   })
  }
  })
  router.post('/decProduct',sessionverify2,(req,res)=>{
   
    decProduct(req.body,req.session.user).then(()=>{
      res.json({status:true})
    })
  })
  router.get('/delete-cart/:id',sessionverify2,(req,res)=>{
    deleteCart(req.params.id,req.session.user).then(()=>{
      res.json({status:true})
    })
  })
  router.post('/addProductCount',sessionverify2,(req,res)=>{
    
    addProductCount(req.body,req.session.user).then(()=>{
      res.json({status:true})
    }).catch(()=>{
      res.json({status:false})
    })
  })
router.get('/getbrand/:id',(req,res)=>{
  let id=req.params.id
  getfunction(id).then(()=>{
    res.redirect('/')
  })
})  
router.get('/getAll/:id',(req,res)=>{
  console.log(req.params.id, "id")
  getfunction(req.params.id).then((product)=>{
    console.log(product,'produ');
    return res.json({product})
  })
})

router.get('/checkout',sessionverify2,async(req,res)=>{
  let data=await getCartItems(req.session.user)
      let count = await getCartCount(req.session.user)
      let total = await totalAmount(req.session.user)
      let subtotal=await subTotal(req.session.user)
      let dicounts=await findDiscount(req.session.user)
      let grandTotal =(data.total-data.discount)+data.shippingCost
      let account = await getAccount(req.session.user.email)
  await cartIn(req.session.user).then(async()=>{   
let address=await getAddress(req.session.user)
let user = req.session.user
if(address){
      res.render('user/addAddress',{user,account,account,address,data,count,total,subtotal,grandTotal})
}else{
  res.render('user/addAddress',{data,count,total,subtotal,grandTotal})
}

  })    
 .catch((err)=>{
    console.log(err);
    res.redirect('/')
  })
  
})
router.get('/couponOffer',sessionverify2,(req,res)=>{
  getCoupon().then(async(data)=>{
    await res.json({data})
  })
})
router.get('/addToWishlist/:id',sessionverify2,(req,res)=>{
  addToWishList(req.params.id,req.session.user).then((response)=>{
      res.json(response)
   })
})
router.get('/wishlist',sessionverify2,(req,res)=>{
  getAllWishlist(req.session.user).then(async(data)=>{
    if(req.session.user){
      let count = await getCartCount(req.session.user)
      let wishlistCount=await getWishlistCount(req.session.user)
      let user= req.session.user
   
    if(data){
      wishProduct=data.product
      res.render('user/wishlist',{wishProduct,count,wishlistCount,user})
    }
    else{
      res.render('user/wishlist')
    }
  }else{
    res.render('user/wishlist')

  }
   
  })
})
router.get('/delete-wishlist/:id',(req,res)=>{
  console.log(req.params.id);
  deleteWishlist(req.params.id,req.session.user).then(()=>{
    res.json({status:true})
  })
})
router.get('/categoryProducts/:id',async(req,res)=>{
  if(req.session.user){
  let count = await getCartCount(req.session.user)
  let wishlistCount=await getWishlistCount(req.session.user)
let category = await getCategory()
console.log(category,'categorys');
  let user= req.session.user
  findCategory(req.params.id).then((data)=>{
   res.render('user/productViewPage',{data,user,wishlistCount,count,category})
  })
}
else{
  findCategory(req.params.id).then(async(data)=>{
    let category = await getCategory()
console.log(category,'categorys');
    res.render('user/productViewPage',{data,category})
   })
}
  
})
router.get('/brandProduct/:id',(req,res)=>{
  console.log(req.params.id,'brand');
  findBrand(req.params.id).then((data)=>{
    console.log(data);
     res.render('user/productViewPage',{data})
  })
})

router.get('/addAddress',sessionverify2,async(req,res)=>{
  let address= await getAddress(req.session.user)
  res.render('user/addAddress',{address,user})
})

router.post('/addAddress',(req,res)=>{
  addAddress(req.body,req.session.user).then(()=>{
    res.redirect('/addAddress')
  })
})

router.get('/toCart/:id',sessionverify2,(req,res)=>{
  addingToCart(req.params.id,req.session.user).then(()=>{
   res.redirect('/')
  }).catch((err)=>{
    console.log(err);
  })
})
router.get('/productOrderForm/:id',sessionverify2,async(req,res)=>{
  let id=req.params.id
  let user = req.session.user
  let data=await getCartItems(req.session.user)
  let count = await getCartCount(req.session.user)
  let total = await totalAmount(req.session.user)
  let subtotal=await subTotal(req.session.user)
  let dicounts=await findDiscount(req.session.user)
  let wishlistCount=await getWishlistCount(req.session.user)
 findAddress(req.params.id,req.session.user).then((address)=>{
  let grandTotal =(data.total-data.discount)+data.shippingCost
   if(grandTotal!=null && data!=null){
    res.render('user/productOrderForm',{wishlistCount,user,data,address,count,total,subtotal,dicounts,grandTotal,err:req.session.redeemErr})
    req.session.redeemErr=''
   }else{
     res.redirect('/')
   }

 })

})



router.post('/checkingCoupon/:id',(req,res)=>{
  console.log(req.body);
  checkCoupon(req.body,req.session.user).then(()=>{
    res.redirect('/productOrderForm/'+req.params.id)
  }).catch((err)=>{
    console.log('err');
    req.session.redeemErr=err.msg
    res.redirect('/productOrderForm/'+req.params.id)

  })
})

router.post('/placeOrder',(req,res)=>{
  checkStock(req.session.user).then((response)=>{
if(response.stockout){
  res.json({stockout:true})
}else{
  placeOrder(req.session.user,req.body).then(async(orderId)=>{ 
    if(req.body.paymentMethod=='COD'){
      let theOrder =  await Order.find({_id:orderId})
     await Cart.findOneAndDelete({userId:req.session.user.email})
     res.json({status:true})
    }
    else{
      generateRazor(orderId,req.session.user).then((response)=>{
        console.log(response,'response');
        res.json({response})
      })
    }
  })
}
  })
  

})
router.post('/verifyPayment',(req,res)=>{
  console.log(req.body,'req.body');
  verifyPayment(req.body,req.session.user).then(()=>{
    console.log('successfull');
    res.json({status:true})
  }).catch((err)=>{
    res.json({status:'payment failed'})
  })
})

router.post('/filter',(req,res)=>{
  console.log(req.body['price-max']);
 priceFilter(req.body).then((data)=>{
   console.log(data,'data got');
   res.json({data})
 })
})

router.post('/searchProduct',async(req,res)=>{
  if(req.session.user){
    let count = await getCartCount(req.session.user)
  let wishlistCount=await getWishlistCount(req.session.user)
  let user= req.session.user
  search(req.body).then((data)=>{
    res.render('user/searchProduct',{data,count,wishlistCount,user})
    })
  }
else{
  search(req.body).then((data)=>{
    res.render('user/searchProduct',{data})
    })
}
})

router.post('/addProfile',(req,res)=>{
  console.log(req.body);
  addProfile(req.body,req.session.user).then(()=>{
    res.redirect('/account/'+req.session.user.email)
  })
})

router.get('/viewOrder',sessionverify2,(req,res)=>{
  viewOrder(req.session.user.email).then(async(data)=>{
    let count = await getCartCount(req.session.user)
    // let total = await totalAmount(req.session.user)
    let user = req.session.user
    res.render('user/viewOrders',{data,user,count})
  })
})
router.get('/cancelOrder/:id',(req,res)=>{
  console.log(req.params.id,'userjs id');
  cancelOrder(req.params.id,req.session.user).then(()=>{
   res.json({status:true})
  })
})

router.get('/orderSuccessfull',(req,res)=>{
  sortOrder(req.session.user.email).then((data)=>{ 
    res.render('user/orderSuccessfull',{data})
  })
})

router.get('/download',(req,res)=>{
  sortOrder(req.session.user.email).then((data)=>{
    res.json({data})
  })
})



router.get('/singleOrderView/:id',sessionverify2,(req,res)=>{
  console.log(req.params.id,'id');
getSingleProduct(req.params.id,req.session.user).then((data)=>{
console.log('singleProduct',data,'data');
data.product.forEach((prdt)=>{
  res.render('user/singleOrderView',{Data:prdt})
})
})
})

router.get('/deleteOrder/:id',(req,res)=>{
  console.log(req.params.id,'id');
  deleteOrder(req.params.id,req.session.user).then(()=>{
    res.json({status:true})
  })
})
router.post('/paymentFailed',(req,res)=>{
  console.log('req.body');
paymentFailed(req.body).then(()=>{
  res.json({status:true})
})
})

router.post('/profileImage',storage.fields([{name:'profileImg',maxCount:1}]),(req,res)=>{
  let img1=req.files.profileImg[0].filename
  addProfileImg(img1,req.session.user).then(()=>{
    console.log('successimg');
    res.redirect('/account/'+req.session.user.email)
  })
})

router.get('/Products',async(req,res)=>{
  let allBrands = await getBrand()
  let allCategory  = await getCategory()
  if(req.session.user){
    var user = req.session.user
    let count = await getCartCount(req.session.user)
    let wishlistCount=await getWishlistCount(req.session.user)
    res.render('user/fullProduct',{allBrands,allCategory,filterResult,user,count,wishlistCount})

  }else{
    res.render('user/fullProduct',{allBrands,allCategory,filterResult})
  }

  })
// router.get('/allProducts')
router.post('/search-filter',(req,res)=>{
  searchFilter(req.body).then((result)=>{
    filterResult = result
    res.json({status:true})
  })
})
router.get('/fullProduct',async(req,res)=>{
  filterResult = await productDetail()
res.redirect('/Products')
})

router.post('/productReview',(req,res)=>{
  productReview(req.body,req.session.user).then(()=>{
    res.redirect('/viewOrder')
  })
})

router.get('/deleteAddress/:id',(req,res)=>{
  deleteAddress(req.params.id,req.session.user).then(()=>{
    res.redirect('/addAddress')
  })
})
module.exports = router;





