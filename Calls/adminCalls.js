const { reject, use } = require('bcrypt/promises')
const async = require('hbs/lib/async')
var adminModel = require('../Model/admin-schema')
var Product = require('../Model/product-schema')
var userModel = require('../Model/user-schema')
var fs = require('fs')
const { resolve } = require('path')
const res = require('express/lib/response')
const category = require('../Model/category-schema')
var jwt = require('jsonwebtoken')
const Brand = require('../Model/brand-schema')
const Coupon = require('../Model/coupon-schema')
const Order = require('../Model/order-schema')
const Cart = require('../Model/cart-schema')
const { log } = require('console')
const { router } = require('../app')
const adminLogin = (data) => {
    console.log(data,'req.body');
    return new Promise(async (resolve, reject) => {

        const user = await adminModel.findOne({ email: data.email })
        console.log(user);
        if (user) {
            if (user.password == data.password) {
                let token = jwt.sign({ _id: this._id }, 'secret', { expiresIn: 300 })
                console.log(token);
                resolve({ status: true, token })
            } else {
                reject({ msg: 'check your password' })
            }
        } else {
            reject({ msg: 'Enter valid mail and password' })
        }
    })
}
const addingProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        const user = await userModel.findOne({ email: data.email })
        if (user) {
            reject({ msg: 'email already taken' })
        } else {
            const newUser = await new userModel({
                lName: data.lName,
                fName: data.fName,
                email: data.email,
                password: data.password
            })
            await newUser.save(async (err, result) => {
                if (err) {
                    reject({ msg: 'somthing went wrong' })
                } else {

                    resolve({ status: true })
                }

            })
        }
    })
}
const allUsers = () => {
    return new Promise(async (resolve, reject) => {
        const user = await userModel.find({}).lean()
        resolve(user)
    })
}
const deleteUser = (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        const user = await userModel.deleteOne({ email: data })

        resolve()
    })
}
const findingUser = (data) => {
    return new Promise(async (resolve, reject) => {
        const user = await userModel.findOne({ email: data })
        resolve({ user })
    })
}
const editingUser = (data, id) => {
    return new Promise(async (resolve, reject) => {
        const user = await userModel.findOne({ email: id })
        if (user) {
            await userModel.findOneAndUpdate({ email: id }, { $set: { fName: data.fName, lName: data.lName } })
            resolve()
        }

    })

}
const blockUser = (data) => {
    return new Promise(async (resolve, reject) => {
        const user = await userModel.findOneAndUpdate({ email: data }, { $set: { status: false } })
        resolve()
    })
}
const unBlockUser = (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        const user = await userModel.findOneAndUpdate({ email: data }, { $set: { status: true } })
        resolve()
    })
}


const uploadFiles = (data, img1, img2, img3) => {
    return new Promise(async (resolve, reject) => {
        if (data.discount > data.price) {
            reject({ msg: 'discount price is greater than original price' })
        } else {
            if (!img2 || !img1 || !img3) {
                reject({ msg: 'Please upload files' })
            }
            else {
                let newUpload = await new Product({
                    images: { img1, img2, img3 },
                    productName: data.productName,
                    price: data.price,
                    stock: data.stock,
                    description: data.description,
                    category: data.category,
                    brand: data.brand,
                    shippingCost: data.shippingCost,
                    discount: data.discount,
                    os: data.os,
                    processor: data.processor,
                    memory: data.memory,
                    hardDrive: data.hardDrive,
                    color: data.color
                })
                await newUpload.save((err, result) => {
                    if (err) {
                        console.log(err);
                        reject({ msg: 'somthing went wrong' })
                    } else {

                        resolve({ data: result, msg: 'success' })
                    }

                })
            }
        }

    })
}
const viewProducts = () => {
    return new Promise(async (resolve, reject) => {
        const product = await Product.find({}).lean()
        resolve(product)
    })
}

const deleteProducts = (id) => {
    return new Promise(async (resolve, reject) => {
        await Product.findOneAndDelete({ product: id })
        resolve()
    })
}

const productDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        const product = await Product.findOne({ productName: id }).lean()
        resolve(product)
    })
}

const editedProduct = (data, img1, img2, img3, id) => {
    return new Promise(async (resolve) => {
        const product = await Product.findOneAndUpdate({ productName: id }, {
            $set: {
                images: { img1, img2, img3 },
                productName: data.productName,
                price: data.price,
                stock: data.stock,
                description: data.description,
                category: data.category,
                brand: data.brand,
                shippingCost: data.shippingCost,
                discount: data.discount,
                os: data.os,
                processor: data.processor,
                memory: data.memory,
                hardDrive: data.hardDrive,
                color: data.color
            }
        })
        resolve()
    })
}
const totalProducts = () => {
    return new Promise(async (resolve, reject) => {
        const total = await Product.find().count()
        resolve(total)
    })
}
const totalUsers = () => {
    return new Promise(async (resolve, reject) => {
        const total = await userModel.find().count()
        resolve(total)
    })
}
const getCategory = () => {
    return new Promise(async (resolve, reject) => {
        let count = await category.find({}).count()
        categories = await category.find({}).lean()
        resolve({categories,count})
    })
}
const addCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        isCategory = await category.findOne({ name: data.category })
        if (isCategory) {
            reject({ status: false, msg: 'added category already exist' })
        } else {
            const newcategory = await category({
                name: data.category,
            })
            await newcategory.save((err, data) => {
                if (err) {
                    console.log(err);
                    reject({ msg: 'something went wrong' })
                }
            })
            resolve()
        }
    })
}
const addBrand = (data) => {
    return new Promise(async (resolve, reject) => {
        const brand = await Brand.findOne({ name: data.brand })
        if (brand) {
            reject({ msg: 'entered brand is already in list' })
        }
        else {
            const newBrand = await Brand({
                name: data.brand
            })
            await newBrand.save((err, data) => {
                if (err) {
                    reject({ msg: 'something went wrong' })
                }
            })
            resolve()
        }
    })
}
const getBrand = () => {
    return new Promise(async (resolve, reject) => {
        let count = await Brand.find({}).count()
        allBrands = await Brand.find({}).lean()
        resolve({allBrands,count})
    })
}
const addCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        ifExist = await Coupon.findOne({ couponCode: data.couponCode })
        if (ifExist) {
            reject({ msg: 'coupon code already exist' })
        }
        else {
            if (data.limit <= 4) {
                reject({ msg: 'coupon limit must be atleast 5' })
            }
            else {
                const newCoupon = await new Coupon({
                    couponCodeName: data.CouponName,
                    couponCode: data.couponCode,
                    discount: data.discount,
                    limit: data.limit,
                    expirationTime: data.expirationTime,
                })
                await newCoupon.save((err, data) => {
                    if (err) {
                        reject({ msg: 'something went wrong' })
                    }
                })
                resolve()
            }
        }
    })
}

const getAllCoupons = () => {
    return new Promise(async (resolve, reject) => {
        let allCoupons = await Coupon.find({}).lean()
        if (allCoupons) {
            resolve(allCoupons)
        } else {
            resolve()
        }
    })
}
const deleteCoupon = (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
        await Coupon.findOneAndDelete({ couponCode: data })
        resolve()
    })
}

const totalCoupons=()=>{
    return new Promise(async(resolve,reject)=>{
       let count= await Coupon.find().count()
       resolve(count)
    })
}

const allOrders=()=>{
    return new Promise(async(resolve,reject)=>{
        let orders= await Order.find({}).lean()
       if(orders){
           resolve(orders)
       }else{
           resolve()
       }
    })
}
const viewOrder=(id,user)=>{
    console.log(id,'id');
    console.log(user,'id');
    return new Promise(async(resolve,reject)=>{
        let orderDeteils= await Order.findOne({userId:user,'product._id':id}).lean()
        console.log(orderDeteils,'orderDeteils');
       resolve(orderDeteils)
    })
}

const findCart=(data)=>{
    return new Promise(async(resolve,reject)=>{
        let isCart = await Cart.findOne({userId:data.userId})
        resolve(isCart)
    })
}

const changeStatus=(data)=>{
    return new Promise(async(resolve,reject)=>{
        if(data.data==1){
            await Order.findOneAndUpdate({userId:data.user, "product._id": data.id },{$set:{'product.$.status':'Shipped'}})
            resolve()
        }else{
            await Order.findOneAndUpdate({userId:data.user, "product._id": data.id },{$set:{'product.$.status':'Delivered'}})
            resolve()
            }
    
    })
}

const totalOrders=()=>{
    return new Promise(async(resolve,reject)=>{
        let count =await Order.find({}).count().lean()
        resolve(count)
    })
}


const totalSales = ()=>{
    return new Promise(async(resolve,reject)=>{
        let orders = await Order.find({})
        console.log(orders,'orders');
        let totalSales = 0;
       orders.map((e)=>{
          totalSales += e.totalAmount
        })
        console.log(totalSales,'totalSales');
        resolve(totalSales)
    })
}

const paymentstatus = ()=>{
    return new Promise(async(resolve,reject)=>{
        let orders = await Order.find({})
        let success = 0;    
        orders.map((e)=>{
            e.product.map((p)=>{
                    if(p.paid == 'payment completed'){
                        success +=e.totalAmount
                    }
            })
        })
        console.log(success,'success payment');
        resolve(success)
    })
}

const getChartData=(data)=>{
    return new Promise(async(resolve,reject)=>{
       
     let    d1 = new Date();
        d1.setDate(d1.getDate() - 7);
     let   d2 = new Date();
     let   text = "For the Last 7 days";

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
    console.log(salesReport, "sales ");

    let dateArray = [];
    let totalArray = [];
    salesReport.forEach((s) => {
      dateArray.push(`${month}-${s._id} `);
      totalArray.push(s.total);
    });

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


let brandArray = [];
let sumArray = [];
brandReport.forEach((s) => {
  brandArray.push(s._id);
  sumArray.push(s.totalAmount);
});

console.log(brandReport,'brandreport');

   resolve({dateArray,totalArray,brandArray,sumArray})
    })
}



module.exports = {
    totalCoupons,allOrders,viewOrder,findCart,changeStatus,totalOrders,totalSales,paymentstatus,getChartData,
    deleteCoupon, getAllCoupons, addCoupon, getBrand, addBrand, addCategory, getCategory, adminLogin, addingProduct, allUsers, deleteUser, findingUser, editingUser, totalUsers,
    blockUser, unBlockUser, uploadFiles, viewProducts, deleteProducts, productDetails, editedProduct, totalProducts
}



