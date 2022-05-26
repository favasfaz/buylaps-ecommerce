const async = require('hbs/lib/async')
const Model =require('../Model/user-schema')
const nodeMailer = require('nodemailer')
var jwt = require ('jsonwebtoken')
const res = require('express/lib/response')
const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const { reject } = require('bcrypt/promises')
const Product =require('../Model/product-schema')
const Cart = require('../Model/cart-schema')
var objectId = require('objectid')
const { adminLogin } = require('./adminCalls')

// var otpCode =  Math.floor(1000 + Math.random() * 9999)


const reSend=(data)=>{
    console.log(data);
    return new Promise(async(resolve,reject)=>{
        var otpCode =  Math.floor(1000 + Math.random() * 9999)
        let mailTransporter=nodeMailer.createTransport({
            service:'gmail',
            auth:{
                user:'mohamedsabithmp@gmail.com',
                pass:'ceuggzhsmkznyfdz'
            }
        });
        let mailDetails={
            form:'mohamedsabithmp@gmail.com',
            to:data,
            subject:'testing',
            text: 'otp is'+otpCode
        };
        mailTransporter.sendMail(mailDetails,function(err,data){
            if(err){
                console.log('err');
            }else{
                console.log('emailsend');
            }
        
        })
        console.log(otpCode);
        console.log('lll');
        resolve({msg:'success' ,data:data,otpCode:otpCode})
    })
}

const doSignup = (data)=>{
return new Promise(async(resolve,reject)=>{
    console.log(data.email);
if(data.password==data.cpassword){
if(data.password.length<4){
reject({status:false,msg:'password atleast 4 charchters'})
}  else{
 const user =await Model.findOne({email:data.email})
    if (user){
      await  reject({status:false,msg:'Email already taken'})
    }
    else{
        var otpCode =  Math.floor(1000 + Math.random() * 9999)
        let mailTransporter=nodeMailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:'mohamedsabithmp@gmail.com',
                            pass:'ceuggzhsmkznyfdz'
                        }
                    });
                    let mailDetails={
                        form:'mohamedsabithmp@gmail.com',
                        to:data.email,
                        subject:'testing',
                        text: 'otp is'+otpCode
                    };
                    mailTransporter.sendMail(mailDetails,function(err,data){
                        if(err){
                            console.log('err');
                        }else{
                            console.log('emailsend');
                        }
                    
                    })
                    console.log(otpCode);

                    resolve({msg:'success' ,data:data,otpCode})
     
    }
} 
}else{
    reject({status:false,msg:'password are not matching'})
}
  
})
}
// var  OTP=otpCode
 const registeringUser =(userdata,userotp,sessionotp)=>{
   return new Promise (async(resolve,reject)=>{
       console.log('re');
       

       if(userotp.otp==sessionotp){
        const newUser =await new Model({
                lName:userdata.lName,
                fName:userdata.fName,
                email:userdata.email,
                password: userdata.password,
                phone:userdata.phone
            })  
            await newUser.save(async(err,result)=>{
                    if(err){
                        reject({msg:'somthing went wrong'})
                    }else{
                        let token = jwt.sign({_id:this._id},'secret',{expiresIn:300})

                        resolve({status:true,token})
                    }

            })

        
        }else{
                reject({msg:'otp not match'})
        }
   })
     
 }
// --------------------------------------------------------------------------------------------------------------------------------------------------


const userLogin = (data)=>{
    return new Promise(async(resolve,reject)=>{
        const user=await Model.findOne({email:data.email})
        if (user){
            if(user.status==false){
                reject({msg:'admin blocked'})
            }else{

            if(user.password==data.password){
                const token=await jwt.sign({id:this.id},"secret",{expiresIn:'1d'})
                await resolve({status:true,token})
                   }else{
                    await reject({status:false,msg:'check your password'})
            }
            }
        }else{
            reject({status:false,msg:'check your mail and password'})
        }
    })
}
const getAccount =(data)=>{
return new Promise(async(resolve,reject)=>{
const product = await Model.findOne({email:data}).lean()
resolve(product)
})
}
const forgotpass=(data)=>{
    return new Promise(async(resolve,reject)=>{
     console.log(data);
        const user= await Model.findOne({email:data.email})
        if(user){
         
            // -------------------------------------------------
            const otpCode = await Math.floor(1000 + Math.random() * 9999)
           await Model.findOneAndUpdate({email:data.email},{$set:{otpcode:otpCode}})
                console.log(otpCode);
            let mailTransporter=await nodeMailer.createTransport({
                service:'gmail',
                auth:{
                    user:'mohamedsabithmp@gmail.com',
                    pass:'ceuggzhsmkznyfdz'
                }
            });
            let mailDetails={
                form:'mohamedsabithmp@gmail.com',
                to:data.email,
                subject:'forgot password',
                text:"your reset otp code is"+otpCode
            };
            mailTransporter.sendMail(mailDetails,function(err,data){
                if(err){
                    console.log('err');
                }else{
                    console.log('emailsend');
                }
            
            })
            // ------------------------------------------------------
            resolve({user})
        }
        else{
            reject({status:false,msg:"Enter a valid email"})
        }
    })
}

const otpVerify = (data,id) =>{
    console.log(data.otp);
    return new Promise(async(resolve,reject)=>{
     const user= await Model.findOne({email:id})
     console.log(user.otpcode);
     if(user.otpcode==data.otp){
         resolve({msge:"otp matched"})
     }else{
         reject({status:false,msg:"OTP not match"})
     }
    })
}

const newPass = (data,id)=>{
   return new Promise(async(resolve,reject)=>{
    if(data.password==data.cpassword){
       if(data.password.length<4){
           reject({msg:'password is TOOshort'})
       }
       else{
        await Model.findOneAndUpdate({email:id},{$set:{password:data.password}})
        resolve({status:true})
       }
    }else{
        reject({status:false,msg:"password not match"})
    }
   })
   
}
const settingPassword =(data,id)=>{
return new Promise(async(resolve,reject)=>{
   const user=await Model.findOne({email:id})
   if(user){
        if(user.password==data.password){
                if(data.newPassword==data.cPassword){
                            if(data.newPassword.length<4){
                                reject({msg:'password is tooshort'})
                            }else{
                            await Model.findOneAndUpdate({email:id},{$set:{password:data.newPassword}})
                                resolve()
                            }
                }else{
                    reject({msg:'new password and confirm password are not match'})
                }
        }else{
            reject({msg:'current password is not match'})
        }
   }else{
       reject({msg:'something went wrong'})
   }
})
}

 const productDetail=()=>{
     return new Promise(async(resolve,reject)=>{
         const product =await Product.find({}).lean()
         resolve(product)
     })
 }
 
const addingToCart=(id,data)=>{
    return new Promise(async(resolve,reject)=>{
      console.log(id);
        let userCart= await Cart.findOne({userId:data.email})
        let products=await Product.findOne({_id:id})
    
    
    if(userCart){
                let exist=userCart.product.findIndex(product=>product.productId==id)
                if(exist!=-1){
                    await Cart.updateOne({'product.productId':id},{$inc:{'product.$.quantity':1}})
                   
                    resolve()
                }else{
                await Cart.findOneAndUpdate({userId:data.email},{$push:{product:{productId:id,quantity:1,name:products.productName,price:products.price,brand:products.brand,image:products.images[0].img1}}})
                resolve()
            }
        }else{
            let newCart= new Cart({
                userId:data.email,
                product:{productId:id,quantity:1,name:products.productName,price:products.price,brand:products.brand,image:products.images[0].img1},
                total:products.price
            })
             newCart.save(async(err,data)=>{
                if(err){
                    console.log(err);
                    reject({msg:'something went wrong'})
                }
                else{
                    resolve()
                }
            })
        } 
      })
}

const getCartItems=(data)=>{
    console.log(data.email);
    return new Promise(async(resolve,reject)=>{
      const user= await Cart.findOne({userId:data.email}).lean()
      resolve(user)
    })
}

const productDetails =(id)=>{
    return  new Promise(async(resolve,reject)=>{
        const product=await Product.findOne({productName:id}).lean()
        resolve(product)
    })
} 

const getCartCount = (data)=>{
    console.log(data);
return new Promise(async(resolve,reject)=>{
    const cart = await Cart.findOne({userId:data.email})
    console.log(cart);
    if(cart){
         count=  cart.product.length
          console.log(count);
          resolve(count)
    }
    else{
        let count=0
        resolve(count)
    }
})
}
const decProduct=(data,user)=>{
    return new Promise(async(resolve,reject)=>{
        let userCart= await Cart.findOne({userId:user.email})
        if(data.quan<=1){
            resolve()
        }else{
             if(userCart){
            let exist=userCart.product.findIndex(product=>product.productId==data.productId)
                    if(exist!=-1){
                        await Cart.updateOne({'product.productId':data.productId},{$inc:{'product.$.quantity':-1}})
                        resolve()
                    }
        }}
       
    })
}
const deleteCart =(id,data)=>{
    console.log(id);
    return new Promise(async(resolve,reject)=>{
        let userCart= await Cart.findOne({userId:data.email})
        
        if(userCart){
            // let exist= userCart.product.findIndex(product=>product.productId==id)
            await Cart.findOneAndUpdate({userId:data.email},{$pull:{product:{productId:id }}})     
            resolve()

        }
    })
}
const addProductCount=(data,user)=>{
    return new Promise(async(resolve,reject)=>{
        let userCart= await Cart.findOne({userId:user.email})
        // let products=await Product.findOne({_id:id})
        let count= await Cart.aggregate([{$match:{userId:user.email}},{$match:{'product.productId':data.productId}},{$project:{_id:0,quantity:1}}])
     console.log(count);
        if(userCart){
            let exist=userCart.product.findIndex(product=>product.productId==data.productId)
                    if(exist!=-1){
                        await Cart.updateOne({'product.productId':data.productId},{$inc:{'product.$.quantity':1}});
                       
                        resolve()
                    }
        }
    
    })
}
const firstTwo=()=>{
    return new Promise(async(resolve,reject)=>{
       const twoProducts= await Product.find({}).sort({create:-1}).limit(4).lean()
       resolve(twoProducts)
})
}
const totalAmount=(user)=>{
    return new Promise(async(resolve,reject)=>{
        let total = await Cart.aggregate([{
            $match:{userId:user.email}
        },{
            $unwind:'$product'
        },{
            $project:{
                
                quantity:'$product.quantity',
                price:'$product.price'
            }
        },{
            $project:{
                name:1,quantity:1,price:1
            }
        },{
            $group:{
                _id:null,
                total:{$sum:{$multiply:['$quantity','$price']}}
            }
        }
    ])
    resolve(total)
    })
}
module.exports={totalAmount,firstTwo,addProductCount,deleteCart,decProduct,getCartCount,productDetails,doSignup,getCartItems,addingToCart,userLogin,getAccount,forgotpass,otpVerify,newPass,settingPassword,registeringUser,reSend,productDetail}



// const newUser =await new Model({
//     lName:data.lName,
//     fName:data.fName,
//     email:data.email,
//     password: data.password
// })
// await newUser.save(async(err,result)=>{
//     if(err){
//         await reject({status:false,msg:'Something went wrong try again'})
//     }else{


//         let mailTransporter=nodeMailer.createTransport({
//             service:'gmail',
//             auth:{
//                 user:'mohamedsabithmp@gmail.com',
//                 pass:'ceuggzhsmkznyfdz'
//             }
//         });
//         let mailDetails={
//             form:'mohamedsabithmp@gmail.com',
//             to:data.email,
//             subject:'testing',
//             text:otpCode
//         };
//         mailTransporter.sendMail(mailDetails,function(err,data){
//             if(err){
//                 console.log('err');
//             }else{
//                 console.log('emailsend');
//             }
        
//         })
//         let token = jwt.sign({_id:this._id},'secret',{expiresIn:300})

        
//        await resolve({status:true,token})

//     }
// })



   // const secret='secret'+user.password
            // const payload={
            //     email:user.email
            // }
            // const token=jwt.sign(payload,secret,{expiresIn:'5m'})
            // console.log(token);
            // const link =`http://localhost:3000/reset-password/${user.id}/${token}`