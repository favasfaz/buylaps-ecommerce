var express = require('express');
var router = express.Router();
var {adminLogin,addingUser,allUsers,deleteUser,findingUser,editingUser} = require('../Calls/adminCalls')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {
err:req.session.adminLoginErr
   });
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
router.get('/addUser',(req,res)=>{
  res.render('admin/addProduct',{err:req.session.addingErr})
})
router.post('/addUser',(req,res)=>{
  addingUser(req.body).then(()=>{
    res.redirect('/addUser')
  }).catch((err)=>{
    req.session.addingErr=err.msg
    res.redirect('/addUser')
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

router.get('/editUser/:id',(req,res)=>{
  findingUser(req.params.id).then((data)=>{
    console.log(data.user);
    res.render('admin/editProduct',{data:data.user,err:req.session.editErr})
    req.session.editErr=''
  })
})
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
module.exports = router;
