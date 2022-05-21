var express = require('express');
var router = express.Router();
var {adminLogin,addingProduct,allUsers,deleteUser,findingUser,editedProduct,editingUser,blockUser,unBlockUser,uploadFiles,viewProducts,deleteProducts,productDetails} = require('../Calls/adminCalls')
var multer = require('multer')
var storage = require('../uploadMiddleware/multer');
const async = require('hbs/lib/async');
const fs = require('fs');
const { route } = require('../app');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {err:req.session.adminLoginErr });
});
router.post('/login',(req,res)=>{
 adminLogin(req.body).then(()=>{
   res.render('admin/index')
 }).catch((err)=>{
   req.session.adminLoginErr=err.msg
   res.redirect('/')
 })
})
router.get('/viewUser',(req,res)=>{
  allUsers().then((data)=>{
    res.render('admin/viewUser',{'user':data,err:req.session.deleteErr})
    req.session.deleteErr=''
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
  console.log('success');
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
    console.log(data);
    res.render('admin/viewProducts',{data:data})
  }).catch((err)=>{

  })

  })

router.get('/addProducts',(req,res)=>{
  res.render('admin/addProducts')
})
router.post('/addProduct',storage.fields([{name:'images',maxCount:1},{name:'images1',maxCount:1}]),async(req,res)=>{
  console.log('mmmmmmmmmmmmmm');
  let img1=req.files.images[0].filename
  let img2 = req.files.images1[0].filename
  console.log(img1,img2);
  const files=req.files.filename
   uploadFiles(req.body,img1,img2).then((data)=>{
res.redirect('/addProducts')
      console.log('sssssssssss');
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
     console.log(data);
     res.render('admin/editProducts',{data})
   })
 })
 router.post('/editedProduct/:id',storage.fields([{name:'images',maxCount:1},{name:'images1',maxCount:1}]),(req,res)=>{
  console.log('success');
  let img1=req.files.images[0].filename

  let img2 = req.files.images1[0].filename
  let id = req.params.id
  console.log(img1,img2);
  editedProduct(req.body,img1,img2,id).then(()=>{
    res.redirect('/viewProducts')
  })
 })

module.exports = router;
