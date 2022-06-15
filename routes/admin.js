var express = require('express');
var router = express.Router();
var {getChartData,paymentstatus,totalSales,totalOrders,changeStatus,viewOrder,allOrders,totalCoupons,deleteCoupon,getAllCoupons,addCoupon,getBrand,addBrand,addCategory,getCategory,adminLogin,addingProduct,totalUsers,totalProducts,allUsers,deleteUser,findingUser,editedProduct,editingUser,blockUser,unBlockUser,uploadFiles,viewProducts,deleteProducts,productDetails,findCart} = require('../Calls/adminCalls')
var multer = require('multer')
var storage = require('../uploadMiddleware/multer');
const async = require('hbs/lib/async');
const fs = require('fs');
const { route } = require('../app');
var flash =require('connect-flash');
const session = require('express-session');
const category = require('../Model/category-schema');
const Order = require('../Model/order-schema');
const { log } = require('console');


/* GET home page. */
router.get('/',async  (req, res, next)=> {
  let token = req.cookies.adminToken
  if(token){
    console.log('success');
    let orderCount = await totalOrders() 
    let Sales = await totalSales()
    let successPayment = await paymentstatus()
    let chart = await getChartData()
    console.log(chart,'chartdata');
    let refund = Sales - successPayment
    console.log(orderCount , 'home');
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
    res.render('admin/index',{admin:true,orderCount,Sales,refund,successPayment,})
  }else{
    res.render('admin/login', {err:req.session.adminLoginErr });
    req.session.adminLoginErr=''
  }
});
router.post('/login',(req,res)=>{
 adminLogin(req.body).then((data)=>{
   console.log(data.token);
  res.cookie('adminToken',data.token,{httpOnly:true})
   req.session.loggedIn=true
   req.session.admin=req.body
   res.render('admin/index')
 }).catch((err)=>{
   req.session.adminLoginErr=err.msg
   res.redirect('/')
 })
})
router.get('/viewUser',(req,res)=>{
  allUsers().then((data)=>{
    totalUsers().then((count)=>{
      res.render('admin/viewUser',{'user':data,err:req.session.deleteErr,count})
      req.session.deleteErr=''
    })
   
  })
})

router.get('/deleteUser/:id',(req,res)=>{
  console.log(req.params.id);
  deleteUser(req.params.id).then(()=>{
    res.redirect('/viewUser')
  }).catch(()=>{
    req.session.deleteErr="something went wrong when deleting"
    res.redirect('/viewUser')
  })
})


router.post('/adminAdded/:id',(req,res)=>{
  let id=req.params.id
editingUser(req.body,id).then(()=>{
res.redirect('/viewUser')
}).catch((err)=>{
req.session.editErr=err.msg
console.log(req.session.editErr);
res.redirect('/editUser/' + id)
})
})
router.get('/blockUser/:id',(req,res)=>{
  blockUser(req.params.id).then(()=>{
    res.redirect('/viewUser')
  })
})
router.get('/unBlockUser/:id',(req,res)=>{
  unBlockUser(req.params.id).then(()=>{
    res.redirect('/viewUser')
  })
})
router.get('/viewProducts',(req,res)=>{
  viewProducts().then((data)=>{
    totalProducts().then((count)=>{
      const alert= req.flash('msg')
      res.render('admin/viewProducts',{data,count,alert})
    })
  }).catch((err)=>{

  })

  })

router.get('/addProducts',(req,res)=>{
  getCategory().then((data)=>{
    getBrand().then((allBrands)=>{
      alert=req.flash('msg')
      res.render('admin/addProducts',{data,allBrands,alert,err:req.session.addProductErr})
      req.session.addProductErr=''
    })
   
  })
  
})
router.post('/addProduct',storage.fields([{name:'images',maxCount:1},{name:'images1',maxCount:1},{name:'images2',maxCount:1}]),async(req,res)=>{
  console.log('mmmmmmmmmmmmmm');
  let img1=req.files.images[0].filename
  let img2 = req.files.images1[0].filename
  let img3 = req.files.images2[0].filename

  const files=req.files.filename
   uploadFiles(req.body,img1,img2,img3).then((data)=>{
     req.flash('msg','Successfully Product Added')
res.redirect('/addProducts')
  }).catch((err)=>{
    req.session.addProductErr=err.msg
    res.redirect('/addProducts')
  })

 
})
router.get('/deleteProduct/:id',(req,res)=>{
  let id= req.params.id
  deleteProducts(id).then(()=>{
    res.redirect('/viewProducts')
  })
})

 router.get('/editProduct/:id',(req,res)=>{
  let id= req.params.id
   productDetails(id).then((data)=>{
    getCategory().then((Category)=>{
      getBrand().then((allBrands)=>{
    console.log(Category,'category')
    console.log(allBrands,'brands');
       res.render('admin/editProducts',{data,Category,allBrands})
      })
    })
   })
 })
 router.post('/editedProduct/:id',storage.fields([{name:'images',maxCount:1},{name:'images1',maxCount:1},{name:'images2',maxCount:1}]),(req,res)=>{
  let img1=req.files.images?req.files.images[0].filename:req.body.image1
  let img2=req.files.images1?req.files.images1[0].filename:req.body.image2
  let img3=req.files.images2?req.files.images1[0].filename:req.body.image3

  let id = req.params.id
  console.log(img1,img2);
  editedProduct(req.body,img1,img2,img3,id).then(()=>{
    req.flash('msg','Successfully Product Edited')
    res.redirect('/viewProducts')
  })
 })

router.get('/productZoom/:id',(req,res)=>{
  let id =req.params.id
  productDetails(id).then((data)=>{
    res.render('admin/productZoom',{data})
 })
})
router.get('/category',async(req,res)=>{
  getCategory().then((data)=>{
    getBrand().then((allBrands)=>{
    res.render('admin/category',{data,allBrands,categoryErr:req.session.categoryErr,brandErr:req.session.brandErr})
 })
  })
})
router.post('/addCategory',(req,res)=>{
  console.log(req.body);
  addCategory(req.body).then(()=>{
    res.redirect('/category')
  }).catch((err)=>{
    req.session.categoryErr=err.msg
    res.redirect('/category')
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.clearCookie('adminToken')
res.redirect('/')
})
router.post('/addBrand',(req,res)=>{
  addBrand(req.body).then(()=>{
    res.redirect('/category')
  }).catch((err)=>{
    req.session.brandErr=err.msg
    res.redirect('/category')
  })
})

router.get('/addCoupon',async(req,res)=>{
  let count=await totalCoupons()
  alert=req.flash('msg')
  let allCoupons= await getAllCoupons()
  console.log(allCoupons);
  res.render('admin/coupon',{err:req.session.couponErr,alert,allCoupons,count})
  req.session.couponErr=''
})
router.post('/addCoupon',(req,res)=>{
  addCoupon(req.body).then(()=>{
   
    req.flash('msg','Successfully Coupon Added')
    res.redirect('/addCoupon')
  }).catch((err)=>{
    req.session.couponErr=err.msg
    console.log('lllllllllllllllllllllllll');
    res.redirect('/addCoupon')
  })
})

router.get('/deleteCoupon/:id',(req,res)=>{
deleteCoupon(req.params.id).then(()=>{
  res.redirect('/addCoupon')
})
})
router.get('/allOrders',(req,res)=>{
  allOrders().then((data)=>{
    console.log(data,'data');
   res.render('admin/allOrders',{data})
  })
})
router.get('/viewDeteils/:id/:id1',(req,res)=>{
 let id = req.params.id
 let user = req.params.id1
  viewOrder(id,user).then((result)=>{
      res.render('admin/orderDeteils',{result})
    })
  
})
router.post('/changeStatus',(req,res)=>{
  console.log(req.body,'req.body');
changeStatus(req.body).then(()=>{
  res.json({status:true})
})
})

router.get('/totalRevenue',(req,res)=>{
 res.render('admin/totalRevenue')
})



router.post('/getData',async(req,res)=>{
 console.log(req.body,'req.body');
  let {startDate,endDate} = req.body

  let d1, d2, text;
  if (!startDate || !endDate) {
      d1 = new Date();
      d1.setDate(d1.getDate() - 7);
      d2 = new Date();
      text = "For the Last 7 days";
    } else {
      d1 = new Date(startDate);
      d2 = new Date(endDate);
      text = `Between ${startDate} and ${endDate}`;
    }
 

// Date wise sales report
const date = new Date(Date.now());
const month = date.toLocaleString("default", { month: "long" });
let salesReport = await Order.aggregate([
{
  $match: {
    created: {
      $lt: d2,
      $gte: d1,
    },
  },
},
{
  $group: {
    _id: { $dayOfMonth: "$created" },
    total: { $sum: "$totalAmount" },
  },
},
]);
console.log(salesReport,'salesReport');

let dateArray = [];
let totalArray = [];
salesReport.forEach((s) => {
dateArray.push(`${month}-${s._id} `);
totalArray.push(s.total);
});

console.log(dateArray,'dateArray');

let brandReport = await Order.aggregate([{
  $unwind: "$product",
},{
  $project:{
      brand: "$product.brand",
      subTotal:"$product.subTotal"
  }
},{
  $group:{
      _id:'$brand',
   totalAmount: { $sum: "$subTotal" },

  }
}

])

let orderCount = await Order.find({created:{$gt : d1, $lt : d2}}).count()
console.log (orderCount,'orderCount');

let Sales = 0;

salesReport.map((t) => {
  Sales += t.total
})

console.log (Sales,'Sales');

let success  = await Order.find({'product.paid':'payment completed'})
let successPayment = 0;

success.map((e)=>{
  successPayment += e.totalAmount
})

let brandArray = [];
let sumArray = [];
brandReport.forEach((s) => {
brandArray.push(s._id);
sumArray.push(s.totalAmount);
});



  res.json({dateArray,totalArray,brandArray,sumArray,orderCount,Sales,successPayment})
 })




module.exports = router;
