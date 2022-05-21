const { reject, use } = require('bcrypt/promises')
const async = require('hbs/lib/async')
var adminModel = require('../Model/admin-schema')
var Product = require('../Model/product-schema')
var userModel = require('../Model/user-schema')
var fs = require('fs')
const { resolve } = require('path')

const adminLogin =(data) =>{
    return new Promise(async(resolve,reject)=>{
        
        const user =await adminModel.findOne({email:data.email})
        console.log(user);
        if(user){
                if(user.password==data.password){
                        resolve()
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


    const uploadFiles = (data,img1,img2)=>{
        return new Promise(async(resolve,reject)=>{
            if(!img2){
                reject({msg:'Please upload files'})
            }
            else{
                let newUpload =await new Product({
                            images: {img1,img2},
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

   const editedProduct =(data,img1,img2,id)=>{
       return new Promise(async(resolve)=>{
           const product = await Product.findOneAndUpdate({productName:id},{
            $set:{
            images: {img1,img2},
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


module.exports={adminLogin,addingProduct,allUsers,deleteUser,findingUser,editingUser,
    blockUser,unBlockUser,uploadFiles,viewProducts,deleteProducts,productDetails,editedProduct}



