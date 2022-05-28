const async = require('hbs/lib/async')
const Model =require('../Model/user-schema')
const nodeMailer = require('nodemailer')
var jwt = require ('jsonwebtoken')
const res = require('express/lib/response')
const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const { reject, use } = require('bcrypt/promises')
const Product =require('../Model/product-schema')
const Cart = require('../Model/cart-schema')
var objectId = require('objectid')
const { adminLogin } = require('./adminCalls')
const Brand = require('../Model/brand-schema')
const Coupon = require('../Model/coupon-schema')
const Wishlist = require('../Model/wishlist-schema')
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
           userdata.password=await bcrypt.hash(userdata.password,10)
           console.log(userdata);
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
                bcrypt.compare(data.password,user.password).then(async(result)=>{
                    if(result){
                        const token=await jwt.sign({id:this.id},"secret",{expiresIn:'1d'})
                         resolve({status:true,token})
                    }
                    else{
                         reject({status:false,msg:'check your password'})
                }
                })
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
        data.password=await bcrypt.hash(data.password,10)
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
                if(data.newPassword==data.cPassword){
                            if(data.newPassword.length<4){
                                reject({msg:'password is tooshort'})
                            }else{
                                bcrypt.compare(data.password,user.password).then(async(result)=>{
                                    if(result){
                                        data.newPassword=await bcrypt.hash(data.newPassword,10)
                                        await Model.findOneAndUpdate({email:id},{$set:{password:data.newPassword}})
                                        resolve()
                                    }else{
                                        reject({msg:'current password is not match'})
                                    }
                                })

                            
                            }
                }else{
                    reject({msg:'new password and confirm password are not match'})
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
                        await Cart.updateOne({userId:user.email,'product.productId':data.productId},{$inc:{'product.$.quantity':-1}})
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
        console.log(data);
        if(userCart){
            // let exist=userCart.product.findIndex(product=>product.productId==data.productId)
            //         if(exist!=-1){
                        
                        await Cart.updateOne({userId:user.email, 'product.productId':data.productId},{$inc:{'product.$.quantity':1}});
                        resolve()
                    // }
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
    // let grandTotal=total.pop()
    // const ifCart=await Cart.findOne({userId:user.email})
    // if (ifCart){
    //     await Cart.findOneAndUpdate({userId:user.email},{$set:{total:grandTotal.total}})
    // }
    
    })
}
const subTotal = (user) =>{
    return new Promise(async(resolve,reject)=>{
      let amount = await Cart.aggregate([
        {
            $match: { userId:user.email }
        },
        {
            $unwind: '$product'
        },
        {
            $project: {
                id:'$product.productId',
                total: {$multiply: [ "$product.price", "$product.quantity" ] }
            } 
        },
        ])
  
        console.log(amount);
        const cart = await Cart.findOne({userId:user.email})
  console.log(cart);
        if(cart){
         amount.forEach(async(amt)=>{
         await Cart.updateMany({'product.productId':amt.id},{$set:{"product.$.total":amt.total}})
        })
        }
        
        resolve({status:true})
    })
  }
  
  const getfunction=(data)=>{
      return new Promise(async(resolve,reject)=>{
          const products= await Product.find({brand:data})
          resolve(products)
      })
  }

  const getBrand=()=>{
    return new Promise(async(resolve,reject)=>{
         allBrands= await Brand.find({}).lean()
        resolve(allBrands)
    })
}
const checkCoupon=(data,user)=>{
   
    return new Promise(async(resolve,reject)=>{
      ifExist=await Coupon.findOne({couponCode:data.coupon})
      if(ifExist){
        if(ifExist.limit<=0){
                reject({msg:'coupon expired'})
                await Coupon.findOneAndDelete({couponCode:ifExist.couponCode})
                console.log('limit');
        }  else{
               
            ifUsed= await Coupon.findOne({couponCode:data.coupon,usedUsers:{$in:[user.email]}})
        if(ifUsed){
            reject({msg:'you already used this coupon'})
            console.log('used');
        }else{
            if( new Date().getTime() >= new Date(ifExist.expirationTime).getTime() ){
                await Coupon.findOneAndDelete({couponCode:ifExist.couponCode})
                console.log('expired');
                reject({msg:'coupon were Expired'})
            }
            else{
                 ifUser= await Cart.findOne({userId:user.email})
                 if(ifUser){
                     
                     const finalTotal=ifUser.total-ifExist.discount
                     console.log(finalTotal);
                     await Coupon.findOneAndUpdate({couponCode:data.coupon},{$set:{usedUsers:user.email}})
                     await Coupon.findOneAndUpdate({couponCode:data.coupon},{$inc:{limit:-1}})
                     resolve()

                 } 
            }
        }
        }
        
      }else{
          reject({msg:'there is no coupon'})
      }
      
    })
}
const getCoupon =()=>{
    return new Promise(async(resolve,reject)=>{
        const allCoupons= await Coupon.find({}).lean()
        console.log(allCoupons);
        resolve(allCoupons)
    })
}
const addToWishList=(proId,user)=>{
    console.log('op99999999999999999999999999999');
    console.log(user);
    console.log(proId);
return new Promise(async(resolve,reject)=>{
   const userWishlist= await Wishlist.findOne({userId:user.email})
   let products=await Product.findOne({_id:proId})
   
   if(userWishlist){
       const ifProduct= await Wishlist.findOne({userId:user.email,product:proId})
       if(ifProduct){
        //    res.status(400).json({msg:'product already in your wishlist'})
        // reject({status:false,msg:'item already in wishlist'})
        resolve({oldProduct:true})
       }else{
        await Wishlist.findOneAndUpdate({userId:user.email},{$push:{product:proId}})
        console.log('success1');
        resolve({newProduct:true})
       }
   }else{
    let newWishlist=await new Wishlist({
        userId:user.email,
        product:proId,
        
    })
    console.log('success2');
    await newWishlist.save(async(err,data)=>{
        if(err){
            // res.status(304).json({msg:'somthing went wrong'})
            reject({msg:'something went wrong'})
        }
        resolve({newProduct:true})
    })
}
 
})
}
const getAllWishlist=(user)=>{
    return new Promise(async(resolve,reject)=>{
        const isWishlist = await Wishlist.findOne({userId:user.email}).populate('product').lean()
         resolve(isWishlist) 

    })
}
const getWishlistCount = (data)=>{
return new Promise(async(resolve,reject)=>{
    const wishlist = await Wishlist.findOne({userId:data.email})
    
    if(wishlist){
         count=  wishlist.product.length
          resolve(count)
    }
    else{
        let count=0
        resolve(count)
    }
})
}

module.exports={getWishlistCount,getAllWishlist,addToWishList,getCoupon,checkCoupon,getBrand,getfunction,subTotal,totalAmount,firstTwo,addProductCount,deleteCart,decProduct,getCartCount,productDetails,doSignup,getCartItems,addingToCart,userLogin,getAccount,forgotpass,otpVerify,newPass,settingPassword,registeringUser,reSend,productDetail}



