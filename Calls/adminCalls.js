const { reject, use } = require('bcrypt/promises')
const async = require('hbs/lib/async')
var adminModel = require('../Model/admin-schema')
var Product = require('../Model/product-schema')
var userModel = require('../Model/user-schema')
var fs = require('fs')
const { resolve } = require('path')
const res = require('express/lib/response')
const category = require('../Model/category-schema')
var jwt = require ('jsonwebtoken')
const Brand = require('../Model/brand-schema')
const Coupon = require('../Model/coupon-schema')

const adminLogin =(data) =>{
    return new Promise(async(resolve,reject)=>{
        
        const user =await adminModel.findOne({email:data.email})
        console.log(user);
        if(user){
                if(user.password==data.password){
                    let token = jwt.sign({_id:this._id},'secret',{expiresIn:300})
                    console.log(token);
                        resolve({status:true,token})
                }else{
                    reject({msg:'check your password'})
                }
        }else{
            reject({msg:'Enter valid mail and password'})
        }
    })
}
const addingProduct = (data) =>{
    return new Promise(async(resolve,reject)=>{
        const user = await userModel.findOne({email:data.email})
        if(user){
            reject({msg:'email already taken'})
        }else{
            const newUser =await new userModel({
                lName:data.lName,
                fName:data.fName,
                email:data.email,
                password:data.password
            })  
            await newUser.save(async(err,result)=>{
                    if(err){
                        reject({msg:'somthing went wrong'})
                    }else{

                        resolve({status:true})
                    }

            })
        }
    })
}
const allUsers=()=>{
    return new Promise(async(resolve,reject)=>{
        const user=await userModel.find({}).lean()
        resolve(user)
    })
}
const deleteUser =(data)=>{
    console.log(data);
    return new Promise(async(resolve,reject)=>{
            const user=await userModel.deleteOne({email:data})
            
            resolve()
    })
}
const findingUser = (data) =>{
return new Promise(async(resolve,reject)=>{
const user = await userModel.findOne({email:data})
resolve({user})
})
}
const editingUser =(data,id)=>{
    return new Promise(async(resolve,reject)=>{
        const user = await userModel.findOne({email:id})
        if(user){
            await userModel.findOneAndUpdate({email:id},{$set:{fName:data.fName,lName:data.lName}})
                    resolve()
        }
        
    })

}
const blockUser =(data)=>{
return new Promise(async(resolve,reject)=>{
const user = await userModel.findOneAndUpdate({email:data},{$set:{status:false}})
resolve()
})
}
const unBlockUser =(data)=>{
    console.log(data);
    return new Promise(async(resolve,reject)=>{
    const user = await userModel.findOneAndUpdate({email:data},{$set:{status:true}})
    resolve()
    })
    }


    const uploadFiles = (data,img1,img2,img3)=>{
        return new Promise(async(resolve,reject)=>{
          if(data.discount>data.price){
              reject({msg:'discount price is greater than original price'})
          }else{
            if(!img2 ||!img1||!img3){
                reject({msg:'Please upload files'})
            }
            else{
                let newUpload =await new Product({
                            images: {img1,img2,img3},
                            productName:data.productName,
                            price:data.price,
                            stock:data.stock,
                            description:data.description,
                            category:data.category,
                            brand:data.brand,
                            shippingCost:data.shippingCost,
                            discount:data.discount,
                            os:data.os,
                            processor:data.processor,
                            memory:data.memory,
                            hardDrive:data.hardDrive,
                            color:data.color
                          })
                        await newUpload.save((err,result)=>{
                          if(err){
                              console.log(err);
                              reject({msg:'somthing went wrong'})
                          }else{
                    
                              resolve({data:result,msg:'success'})
                          }
                    
                    })
                          }
                        }
                        
        })
    }
    const viewProducts= () =>{
        return new Promise(async(resolve,reject)=>{
            const product=await Product.find({}).lean()
            resolve(product)
        })
    }

    const deleteProducts=(id)=>{
return new Promise(async(resolve,reject)=>{
 await Product.findOneAndDelete({product:id})
 resolve()
})
    }

    const productDetails =(id)=>{
        return  new Promise(async(resolve,reject)=>{
            const product=await Product.findOne({productName:id}).lean()
            resolve(product)
        })
    } 

   const editedProduct =(data,img1,img2,img3,id)=>{
       return new Promise(async(resolve)=>{
           const product = await Product.findOneAndUpdate({productName:id},{
            $set:{
            images: {img1,img2,img3},
            productName:data.productName,
            price:data.price,
            stock:data.stock,
            description:data.description,
            category:data.category,
            brand:data.brand,
            shippingCost:data.shippingCost,
            discount:data.discount,
            os:data.os,
            processor:data.processor,
            memory:data.memory,
            hardDrive:data.hardDrive,
            color:data.color
            }
           })
           resolve()
       })
   }
const totalProducts =()=>{
    return new Promise(async(resolve,reject)=>{
        const total = await Product.find().count()
        resolve(total)
    })
}
const totalUsers =()=>{
    return new Promise(async(resolve,reject)=>{
        const total = await userModel.find().count()
        resolve(total)
    })
}
const getCategory=()=>{
    return new Promise(async(resolve,reject)=>{
        categories=await category.find({}).lean()
        resolve(categories)
    })
}
const addCategory=(data)=>{
    return new Promise(async(resolve,reject)=>{
            isCategory=await category.findOne({name:data.category})
            if(isCategory){
                reject({status:false,msg:'added category already exist'})
            }else{
                const newcategory = await category({
                    name:data.category,
                })
                await newcategory.save((err,data)=>{
                    if(err){
                        console.log(err);
                        reject({msg:'something went wrong'})
                    }
                })
                resolve()
            }
    })
}
const addBrand=(data)=>{
    return new Promise(async(resolve,reject)=>{
        const brand= await Brand.findOne({name:data.brand})
        if(brand){
            reject({msg:'entered brand is already in list'})
        }
        else{
            const newBrand= await Brand({
                name:data.brand
            })
            await newBrand.save((err,data)=>{
                if(err){
                    reject({msg:'something went wrong'})
                }
            })
            resolve()
        }
    })
}
const getBrand=()=>{
    return new Promise(async(resolve,reject)=>{
         allBrands= await Brand.find({}).lean()
        resolve(allBrands)
    })
}
const addCoupon=(data)=>{
    return new Promise(async(resolve,reject)=>{
            ifExist= await Coupon.findOne({couponCode:data.couponCode})
            if(ifExist){
                reject({msg:'coupon code already exist'})
            }
            else{
                if(data.limit<=4){
                    reject({msg:'coupon limit must be atleast 5'})
                }
                else{
                    const newCoupon= await new Coupon({
                        couponCodeName:data.CouponName,
                        couponCode:data.couponCode,
                        discount:data.discount,
                        limit:data.limit,
                        expirationTime:data.expirationTime
                    })
                    await newCoupon.save((err,data)=>{
                        if(err){
                            reject({msg:'something went wrong'})
                        }
                    })
                    resolve()
                }
            }
    })
}


module.exports={addCoupon,getBrand,addBrand,addCategory,getCategory,adminLogin,addingProduct,allUsers,deleteUser,findingUser,editingUser,totalUsers,
    blockUser,unBlockUser,uploadFiles,viewProducts,deleteProducts,productDetails,editedProduct,totalProducts}



