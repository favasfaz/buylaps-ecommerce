var express = require('express');
var router = express.Router();
var {getBrand,addBrand,addCategory,getCategory,adminLogin,addingProduct,totalUsers,totalProducts,allUsers,deleteUser,findingUser,editedProduct,editingUser,blockUser,unBlockUser,uploadFiles,viewProducts,deleteProducts,productDetails} = require('../Calls/adminCalls')
var multer = require('multer')
var storage = require('../uploadMiddleware/multer');
const async = require('hbs/lib/async');
const fs = require('fs');
const { route } = require('../app');
var flash =require('connect-flash');
const session = require('express-session');
const category = require('../Model/category-schema');



/* GET home page. */
router.get('/', function(req, res, next) {
  let token = req.cookies.adminToken
  if(token){
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.header("Cache-control","no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0");
    res.render('admin/index')
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
// router.get('/addProduct',(req,res)=>{
//   res.render('admin/addProduct',{err:req.session.addingErr})
// })
// router.post('/addProduct',(req,res)=>{
//   addingProduct(req.body).then(()=>{
//     res.redirect('/addProduct')
//   }).catch((err)=>{
//     req.session.addingErr=err.msg
//     res.redirect('/addProduct')
//   })
// })
router.get('/deleteUser/:id',(req,res)=>{
  console.log(req.params.id);
  deleteUser(req.params.id).then(()=>{
    res.redirect('/viewUser')
  }).catch(()=>{
    req.session.deleteErr="something went wrong when deleting"
    res.redirect('/viewUser')
  })
})

// router.get('/editUser/:id',(req,res)=>{
//   console.log();
//   findingUser(req.params.id).then((data)=>{
//     console.log(data.user);
//     res.render('admin/editUser',{data:data.user,err:req.session.editErr})
//     req.session.editErr=''
//   })
// })
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
  console.log(req.params.id);
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
      res.render('admin/addProducts',{data,allBrands,alert})
    })
   
  })
  
})
router.post('/addProduct',storage.fields([{name:'images',maxCount:1},{name:'images1',maxCount:1},{name:'images2',maxCount:1}]),async(req,res)=>{
  console.log('mmmmmmmmmmmmmm');
  let img1=req.files.images[0].filename
  let img2 = req.files.images1[0].filename
  let img3 = req.files.images2[0].filename

  console.log(img1,img2);
  const files=req.files.filename
   uploadFiles(req.body,img1,img2,img3).then((data)=>{
     req.flash('msg','Successfully Product Added')
res.redirect('/addProducts')
  }).catch((err)=>{
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
router.get('/category',(req,res)=>{

  getCategory().then((data)=>{
    getBrand().then((allBrands)=>{
      console.log(allBrands);
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

module.exports = router;
