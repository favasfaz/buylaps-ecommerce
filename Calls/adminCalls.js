const { reject } = require('bcrypt/promises')
const async = require('hbs/lib/async')
var adminModel = require('../Model/admin-schema')
var userModel = require('../Model/user-schema')

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
const addingUser = (data) =>{
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
        const user=await userModel.find({})
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
            const exist= await userModel.findOne({email:data.email})
            if(exist){
                reject({msg:'email is already exist'})
            }else{
                if(data.password.length<4 || data.password!=data.cpassword){
                    reject({msg:'password is too short OR password is mustbe atleast 4'})
                }else{
                    await userModel.findOneAndUpdate({email:id},{$set:{email:data.email,password:data.password,fName:data.fName,lName:data.lName}})
                    resolve()
                }
            }
        }
        
    })

}
module.exports={adminLogin,addingUser,allUsers,deleteUser,findingUser,editingUser}