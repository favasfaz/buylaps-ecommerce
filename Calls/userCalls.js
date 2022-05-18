const async = require('hbs/lib/async')
const Model =require('../Model/user-schema')
const nodeMailer = require('nodemailer')
var jwt = require ('jsonwebtoken')
const res = require('express/lib/response')
const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const { reject } = require('bcrypt/promises')

var otpCode =  Math.floor(1000 + Math.random() * 9999)


const reSend=(data)=>{
    console.log("llll");
    console.log(data);
    return new Promise(async(resolve,reject)=>{
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
        resolve({msg:'success' ,data:data})
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
                    console.log('lll');
                    resolve({msg:'success' ,data:data})
     
    }
} 
}else{
    reject({status:false,msg:'password are not matching'})
}
  
})
}
var  OTP=otpCode
 const registeringUser =(userdata,userotp)=>{
   return new Promise (async(resolve,reject)=>{
       console.log('re');
       console.log(OTP);

       if(userotp.otp==OTP){
        const newUser =await new Model({
                lName:userdata.lName,
                fName:userdata.fName,
                email:userdata.email,
                password: userdata.password
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
            if(user.password==data.password){
                const token=await jwt.sign({id:this.id},"secret",{expiresIn:'1d'})
                await resolve({status:true,token})
                   }else{
                    await reject({status:false,msg:'check your password'})
            }
        }else{
            reject({status:false,msg:'check your mail and password'})
        }
    })
}
const getAccount =(data)=>{
return new Promise(async(resolve,reject)=>{
const product = await Model.findOne({email:data})
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
module.exports={doSignup,userLogin,getAccount,forgotpass,otpVerify,newPass,settingPassword,registeringUser,reSend}



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