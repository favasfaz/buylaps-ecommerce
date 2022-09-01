const async = require("hbs/lib/async");
const Model = require("../Model/user-schema");
const nodeMailer = require("nodemailer");
var jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const { model } = require("mongoose");
const bcrypt = require("bcrypt");
const { reject, use } = require("bcrypt/promises");
const Product = require("../Model/product-schema");
const Cart = require("../Model/cart-schema");
const Brand = require("../Model/brand-schema");
const Coupon = require("../Model/coupon-schema");
const Wishlist = require("../Model/wishlist-schema");
const category = require("../Model/category-schema");
const Address = require("../Model/address-schema");
const Order = require('../Model/order-schema')
const Razorpay = require('razorpay');
const { log } = require("console");
const { resolve } = require("path");
const { router } = require("../app");

var instance = new Razorpay({
  key_id: 'rzp_test_BGehHwSUiY0EOA',
  key_secret: 'Zl8W6dg3CLH5AAW5D44rHrvs',
});


const reSend = (data) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    var otpCode = Math.floor(1000 + Math.random() * 9999);
    let mailTransporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "mohamedsabithmp@gmail.com",
        pass: "ceuggzhsmkznyfdz",
      },
    });
    let mailDetails = {
      form: "mohamedsabithmp@gmail.com",
      to: data,
      subject: "testing",
      text: "otp is" + otpCode,
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("err");
      } else {
        console.log("emailsend");
      }
    });
    console.log(otpCode);
    console.log("lll");
    resolve({ msg: "success", data: data, otpCode: otpCode });
  });
};

const doSignup = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data.email);
    if (data.password == data.cpassword) {
      if (data.password.length < 4) {
        reject({ status: false, msg: "password atleast 4 charchters" });
      } else {
        const user = await Model.findOne({ email: data.email });
        if (user) {
          await reject({ status: false, msg: "Email already taken" });
        } else {
          var otpCode = Math.floor(1000 + Math.random() * 9999);
          let mailTransporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
              user: "mohamedsabithmp@gmail.com",
              pass:process.env.NODEMAILER_PASS,
            },
          });
          let mailDetails = {
            form: "mohamedsabithmp@gmail.com",
            to: data.email,
            subject: "testing",
            text: "otp is" + otpCode,
          };
          mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
              console.log("err");
            } else {
              console.log("emailsend");
            }
          });
          console.log(otpCode);

          resolve({ msg: "success", data: data, otpCode });
        }
      }
    } else {
      reject({ status: false, msg: "password are not matching" });
    }
  });
};
// var  OTP=otpCode
const registeringUser = (userdata, userotp, sessionotp) => {
  return new Promise(async (resolve, reject) => {
    console.log("re");

    if (userotp.otp == sessionotp) {
      userdata.password = await bcrypt.hash(userdata.password, 10);
      console.log(userdata);
      const newUser = await new Model({
        lName: userdata.lName,
        fName: userdata.fName,
        email: userdata.email,
        password: userdata.password,
        phone: userdata.phone,
      });
      await newUser.save(async (err, result) => {
        if (err) {
          reject({ msg: "somthing went wrong" });
        } else {
          let token = jwt.sign({ _id: this._id }, "secret", { expiresIn: 300 });

          resolve({ status: true, token });
        }
      });
    } else {
      reject({ msg: "otp not match" });
    }
  });
};
// --------------------------------------------------------------------------------------------------------------------------------------------------

const userLogin = (data) => {
  return new Promise(async (resolve, reject) => {
    const user = await Model.findOne({ email: data.email });
    if (user) {
      if (user.status == false) {
        reject({ msg: "admin blocked" });
      } else {
        bcrypt.compare(data.password, user.password).then(async (result) => {
          if (result) {
            const token = await jwt.sign({ id: this.id }, "secret", {
              expiresIn: "1d",
            });
            resolve({ status: true, token });
          } else {
            reject({ status: false, msg: "check your password" });
          }
        });
      }
    } else {
      reject({ status: false, msg: "check your mail and password" });
    }
  });
};
const getAccount = (data) => {
  return new Promise(async (resolve, reject) => {
    const product = await Model.findOne({ email: data }).lean();
    resolve(product);
  });
};
const forgotpass = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    const user = await Model.findOne({ email: data.email });
    if (user) {
      // -------------------------------------------------
      const otpCode = await Math.floor(1000 + Math.random() * 9999);
      await Model.findOneAndUpdate(
        { email: data.email },
        { $set: { otpcode: otpCode } }
      );
      console.log(otpCode);
      let mailTransporter = await nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "mohamedsabithmp@gmail.com",
          pass: "ceuggzhsmkznyfdz",
        },
      });
      let mailDetails = {
        form: "mohamedsabithmp@gmail.com",
        to: data.email,
        subject: "forgot password",
        text: "your reset otp code is" + otpCode,
      };
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("err");
        } else {
          console.log("emailsend");
        }
      });
      // ------------------------------------------------------
      resolve({ user });
    } else {
      reject({ status: false, msg: "Enter a valid email" });
    }
  });
};

const otpVerify = (data, id) => {
  console.log(data.otp);
  return new Promise(async (resolve, reject) => {
    const user = await Model.findOne({ email: id });
    console.log(user.otpcode);
    if (user.otpcode == data.otp) {
      resolve({ msge: "otp matched" });
    } else {
      reject({ status: false, msg: "OTP not match" });
    }
  });
};

const newPass = (data, id) => {
  return new Promise(async (resolve, reject) => {
    if (data.password == data.cpassword) {
      if (data.password.length < 4) {
        reject({ msg: "password is TOOshort" });
      } else {
        data.password = await bcrypt.hash(data.password, 10);
        await Model.findOneAndUpdate(
          { email: id },
          { $set: { password: data.password } }
        );
        resolve({ status: true });
      }
    } else {
      reject({ status: false, msg: "password not match" });
    }
  });
};
const settingPassword = (data, id) => {
  return new Promise(async (resolve, reject) => {
    const user = await Model.findOne({ email: id });
    if (user) {
      if (data.newPassword == data.cPassword) {
        if (data.newPassword.length < 4) {
          reject({ msg: "password is tooshort" });
        } else {
          bcrypt.compare(data.password, user.password).then(async (result) => {
            if (result) {
              data.newPassword = await bcrypt.hash(data.newPassword, 10);
              await Model.findOneAndUpdate(
                { email: id },
                { $set: { password: data.newPassword } }
              );
              resolve();
            } else {
              reject({ msg: "current password is not match" });
            }
          });
        }
      } else {
        reject({ msg: "new password and confirm password are not match" });
      }
    } else {
      reject({ msg: "something went wrong" });
    }
  });
};

const productDetail = () => {
  return new Promise(async (resolve, reject) => {
    const product = await Product.find({}).lean();
    resolve(product);
  });
};

const addingToCart = (id, data) => {
  return new Promise(async (resolve, reject) => {
   
    let userCart = await Cart.findOne({ userId: data.email });
    let products = await Product.findOne({ _id: id });

    if (userCart) {
      let exist = userCart.product.findIndex(
        (product) => product.productId == id
      );
      if (exist != -1) {
        await Cart.updateOne(
          { "product.productId": id },
          { $inc: { "product.$.quantity": 1 } }
        );

        resolve();
      } else {
        await Cart.findOneAndUpdate(
          { userId: data.email },
          {
            $push: {
              product: {
                productId: id,
                quantity: 1,
                name: products.productName,
                price: products.price,
                brand: products.brand,
                image: products.images[0].img1,
                shippingCost: products.shippingCost,
                discount: products.discount,
                stock:products.stock,
                stockLess:products.stockLess
              },
            },
          }
        );
        resolve();
      }
    } else {
      let newCart = new Cart({
        userId: data.email,
        product: {
          productId: id,
          quantity: 1,
          name: products.productName,
          price: products.price,
          brand: products.brand,
          stock:products.stock,
          image: products.images[0].img1,
          shippingCost: products.shippingCost,
          discount: products.discount,
          stockLess:products.stockLess
        },
        total: products.price,
      });
      newCart.save(async (err, data) => {
        if (err) {
          console.log(err);
          reject({ msg: "something went wrong" });
        } else {
          resolve();
        }
      });
    }
  });
};

const getCartItems = (data) => {
  return new Promise(async (resolve, reject) => {
    const user = await Cart.findOne({ userId: data.email }).lean();
    if(user){
      let grandTotal =(user.total-user.discount)+user.shippingCost
      await Cart.findOneAndUpdate({ userId: data.email },{$set:{totalAfterDiscounts:grandTotal}})                      
      resolve(user);
    }
    else
    {
      resolve(user)
    }
    resolve(user)

    
  });
};

const productDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    const product = await Product.findOne({ productName: id }).lean();
    resolve(product);
  });
};

const getCartCount = (data) => {
  return new Promise(async (resolve, reject) => {
    const cart = await Cart.findOne({ userId: data.email });

    if (cart) {
      count = cart.product.length;

      resolve(count);
    } else {
      let count = 0;
      resolve(count);
    }
  });
};
const decProduct = (data, user) => {
  console.log(data.productId,'productId');
  return new Promise(async (resolve, reject) => {
    let userCart = await Cart.findOne({ userId: user.email });
    if (data.quan <= 1) {
      await Cart.findOneAndUpdate({userId:user.email,'product.productId':data.productId},{$pull:{'product':{'productId':data.productId}}})
      resolve();
    } else {
      if (userCart) {
        let exist = userCart.product.findIndex(
          (product) => product.productId == data.productId
        );
        if (exist != -1) {
          await Cart.updateOne(
            { userId: user.email, "product.productId": data.productId },
            { $inc: { "product.$.quantity": -1 } }
          );
          resolve();
        }
      }
    }
  });
};
const deleteCart = (id, data) => {
  console.log(id);
  return new Promise(async (resolve, reject) => {
    let userCart = await Cart.findOne({ userId: data.email });

    if (userCart) {
      // let exist= userCart.product.findIndex(product=>product.productId==id)
      await Cart.findOneAndUpdate(
        { userId: data.email },
        { $pull: { product: { productId: id } } }
      );
      resolve();
    }
  });
};
const addProductCount = (data, user) => {
  return new Promise(async (resolve, reject) => {
    let userCart = await Cart.findOne({ userId: user.email });
    let product = await Product.findOne({ _id: data.productId });
    if (userCart) {
      let ifquantity = userCart.product.map((e) => e.quantity);
      quantity = ifquantity.pop();

      if (quantity < product.stock) {
        await Cart.updateOne(
          { userId: user.email, "product.productId": data.productId },
          { $inc: { "product.$.quantity": 1 } }
        );
        resolve();
      } else {
        reject({ status: false });
      }
    
    }
  });
};
const firstTwo = () => {
  return new Promise(async (resolve, reject) => {
    const twoProducts = await Product.find({})
      .sort({ create: -1 })
      .limit(4)
      .lean();
    resolve(twoProducts);
  });
};
const totalAmount = (user) => {
  return new Promise(async (resolve, reject) => {
    let Discount = await Cart.findOne({userId:user.email})
   if(Discount!=null){
    let AfterDiscounts = (Discount.total-Discount.discount)-Discount.shippingCost
    let total = await Cart.aggregate([
      {
        $match: { userId: user.email },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          quantity: "$product.quantity",
          price: "$product.price",
        },
      },
      {
        $project: {
          name: 1,
          quantity: 1,
          price: 1,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    if (total.length == 0) {
      resolve();
    } else {
      let grandTotal = total.pop();
      await Cart.findOneAndUpdate(
        { userId: user.email },
        { $set: { total: grandTotal.total } }
      );
      await Cart.findOneAndUpdate(
        { userId: user.email },
        { $set: { totalAfterDiscounts: AfterDiscounts } }
      );
      resolve(grandTotal);
    }
    
   }
   resolve()
   
  });
};
const subTotal = (user) => {
  return new Promise(async (resolve, reject) => {
    let amount = await Cart.aggregate([
      {
        $match: { userId: user.email },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          id: "$product.productId",
          
          total: { $multiply: ["$product.price", "$product.quantity"] },
        },
      },
    ]);

    
    const cart = await Cart.findOne({ userId: user.email });
    if (cart) {
      amount.forEach(async (amt) => {
        await Cart.updateMany(
          { "product.productId": amt.id },
          { $set: { "product.$.total": amt.total } }
        );
      });
      let grandTotal =(cart.total-cart.discount)+cart.shippingCost
      await Cart.findOneAndUpdate({ userId: user.email },{$set:{totalAfterDiscounts:grandTotal}})  
  console.log(cart.totalAfterDiscounts,'grandTotal');
      resolve({ status: true });
    }
    resolve()
  });
};

const getfunction = (data) => {
  return new Promise(async (resolve, reject) => {
    const products = await Product.find({ brand: data }).lean();
    console.log(products, "products");
    resolve(products);
  });
};

const getBrand = () => {
  return new Promise(async (resolve, reject) => {
    allBrands = await Brand.find({}).limit(7).lean();
    resolve(allBrands);
  });
};
const checkCoupon = (data, user) => {
  console.log(data);
   return new Promise(async (resolve, reject) => {
    ifExist = await Coupon.findOne({ couponCode: data.coupon });
    if (ifExist) {
      if (ifExist.limit <= 0) {
        reject({ msg: "coupon expired" });
        await Coupon.findOneAndDelete({ couponCode: ifExist.couponCode });
        console.log("limit");
      } else {
        ifUsed = await Coupon.findOne({
          couponCode: data.coupon,
          usedUsers: { $in: [user.email] },
        });
        if (ifUsed) {
          reject({ msg: "you already used this coupon" });
          console.log("used");
        } else {
          if (
            new Date().getTime() >= new Date(ifExist.expirationTime).getTime()
          ) {   
      

            await Coupon.findOneAndDelete({ couponCode: ifExist.couponCode });
          
            reject({ msg: "coupon were Expired" });
          } else {
            ifUser = await Cart.findOne({ userId: user.email });
            if (ifUser) {
              let finalTotal = ifUser.total - ifExist.discount;
              await Coupon.findOneAndUpdate(
                { couponCode: data.coupon },
                { $set: { usedUsers: user.email } }
              );
              await Coupon.findOneAndUpdate(
                { couponCode: data.coupon },
                { $inc: { limit: -1 } }
              );
              await Cart.findOneAndUpdate(
                { userId: user.email },
                { $set: { total: finalTotal } }
              );
              await Cart.findOneAndUpdate(
                { userId: user.email },
                { $set: { couponDiscount: ifExist.discount } }
              );
              resolve();
            }
          }
        }
      }
    } else {
      reject({ msg: "there is no coupon" });
    }
  });
};
const getCoupon = () => {
  return new Promise(async (resolve, reject) => {
    const allCoupons = await Coupon.find({}).lean();
    resolve(allCoupons);
  });
};
const addToWishList = (proId, user) => {
  return new Promise(async (resolve, reject) => {
    const userWishlist = await Wishlist.findOne({ userId: user.email });
    let products = await Product.findOne({ _id: proId });

    if (userWishlist) {
      const ifProduct = await Wishlist.findOne({
        userId: user.email,
        product: proId,
      });
      if (ifProduct) {
        //    res.status(400).json({msg:'product already in your wishlist'})
        // reject({status:false,msg:'item already in wishlist'})
        resolve({ oldProduct: true });
      } else {
        await Wishlist.findOneAndUpdate(
          { userId: user.email },
          { $push: { product: proId } }
        );
        console.log("success1");
        resolve({ newProduct: true });
      }
    } else {
      let newWishlist = await new Wishlist({
        userId: user.email,
        product: proId,
      });
      console.log("success2");
      await newWishlist.save(async (err, data) => {
        if (err) {
          // res.status(304).json({msg:'somthing went wrong'})
          reject({ msg: "something went wrong" });
        }
        resolve({ newProduct: true });
      });
    }
  });
};
const getAllWishlist = (user) => {
  return new Promise(async (resolve, reject) => {
    const isWishlist = await Wishlist.findOne({ userId: user.email })
      .populate("product")
      .lean();
    resolve(isWishlist);
  });
};
const getWishlistCount = (data) => {
  return new Promise(async (resolve, reject) => {
    const wishlist = await Wishlist.findOne({ userId: data.email });
    if (wishlist) {
      count = wishlist.product.length;
      resolve(count);
    } else {
      let count = 0;
      resolve(count);
    }
  });
};
const deleteWishlist = (id, data) => {
  return new Promise(async (resolve, reject) => {
    let userCart = await Wishlist.findOne({ userId: data.email });

    if (userCart) {
      // let exist= userCart.product.findIndex(product=>product.productId==id)
      await Wishlist.findOneAndUpdate(
        { userId: data.email },
        { $pull: { product: id } }
      );
      resolve();
    }
  });
};
const getCategory = () => {
  return new Promise(async (resolve, reject) => {
    categories = await category.find({}).lean();
    resolve(categories);
  });
};
const findCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    const categories = await Product.find({ category: data }).lean();
    resolve(categories);
  });
};
const findDiscount = (user) => {
  return new Promise(async (resolve, reject) => {
    const ifCart = await Cart.findOne({ userId: user.email });

    if (ifCart && ifCart.product.length != 0) {
      const products = ifCart.product;
      let totalShippingCost = 0;
      for (var i = 0; i < products.length; i++) {
        totalShippingCost += products[i].shippingCost;
      }
      let totalDiscount = 0;
      for (let i = 0; i < products.length; i++) {
        totalDiscount += products[i].discount;
      }
      await Cart.findOneAndUpdate(
        { userId: user.email },
        { $set: { discount: totalDiscount } }
      );

      await Cart.findOneAndUpdate(
        { userId: user.email },
        { $set: { shippingCost: totalShippingCost } }
      );
      resolve();
    } else {
      resolve();
    }
  });
};
const findBrand = (data) => {
  console.log(data,'data');
  return new Promise(async (resolve, reject) => {
    const brands = await Product.find({ brand:data}).lean()
    console.log( brands);
    resolve(brands);
  });
};
const cartIn = (user) => {
  return new Promise(async (resolve, reject) => {
   
      let isCart = await Cart.find({ userId: user.email });

      isCart.map(async (e) => {
        if (e.product.length != 0) {
         resolve()
        } else {
          reject();
        }
      });
    
  });
};
const addAddress = (data, user) => {
  return new Promise(async (resolve, reject) => {
    let isAddress = await Address.findOne({ userId: user.email });
    if (isAddress) {
      await Address.findOneAndUpdate(
        { userId: user.email },
        {
          $push: {
            address1: {
              fName: data.fName,
              lName: data.lName,
              companyName: data.company,
              country: data.country,
              streetAddress: data.streetAddress,
              town: data.town,
              state: data.state,
              postCode: data.postCode,
              phone: data.phone,
            },
          },
        }
      );
      resolve();
    } else {
      let newAddress = await Address({
        userId: user.email,
        address1: {
          fName: data.fName,
          lName: data.lName,
          companyName: data.company,
          country: data.country,
          streetAddress: data.streetAddress,
          town: data.town,
          state: data.state,
          postCode: data.postCode,
          phone: data.phone,
        },
      });
      await newAddress.save((err, data) => {
        if (err) {
          console.log(err);
          reject();
        }
        resolve();
      });
    }
  });
};

const getAddress=(user)=>{
  return new Promise(async(resolve,reject)=>{
   let address= await Address.find({userId:user.email}).lean()
   address.map(async (e)=>{
  resolve(e.address1)
   })
resolve(address)
     })
}

const findAddress=(id,user)=>{
  
  return new Promise(async(resolve,reject)=>{
    let address= await Address.findOne({userId:user.email}).lean()
    address.address1.map((e)=>{
      if(e._id==id){
        resolve(e)
      }
    })
  })
}

const checkStock = (user)=>{
  return new Promise(async(resolve,reject)=>{
    let isCart= await Cart.findOne({userId:user.email})
isCart.product.forEach(async(pro)=>{
  let isProduct = await Product.findOne({_id:pro.productId})
  if(isProduct.stock<pro.quantity ||  isProduct.stock<1){
    resolve({stockout:true})
  }else{
    resolve({stockout:false})
  }
})
  })
}

const placeOrder=(user,data)=>{
  return new Promise(async(resolve,reject)=>{
 let isCart= await Cart.findOne({userId:user.email})

const proDetails=[]



isCart.product.forEach(async(pro)=>{
 
    proDetails.push({productId:pro.productId,name:pro.name,price:pro.price,brand:pro.brand,image:pro.image,quantity:pro.quantity,subTotal:pro.total,paymentType:data.paymentMethod})
  
})
   let newOrder = await new Order({
     userId:user.email,
     product:proDetails,
     address:{
       fName:data.fName,
       state:data.fName,
       streetAddress:data.streetAddress,
       town:data.town,
       postCode:data.postCode,
     },
     totalAfterDiscounts:isCart.totalAfterDiscounts,
     totalAmount:isCart.total,
     shippingCost:isCart.shippingCost,
     discount:isCart.discount,
     couponDiscount:isCart.couponDiscount
      })
      await newOrder.save(async(err,done)=>{
        if(err){
          console.log(err);
          reject({msg:'something went wrong'})
        }
        else{
         
          let userOrder = await Order.findOne({userId:user.email,_id:done._id})
          userOrder.product.forEach(async(e,i)=>{
     let product =  await Product.findOneAndUpdate({_id:e.productId},{ $inc: { stock: -e.quantity }})
        if(product.stock<5){
            await Product.findOneAndUpdate({_id:e.productId},{$set:{stockLess:true}})
        }else{
          await Product.findOneAndUpdate({_id:e.productId},{$set:{stockLess:false}})
        }
          })
     resolve(userOrder._id)
        }
      })


  })
}

const generateRazor=(orderid,user)=>{
  return new Promise(async(resolve,reject)=>{
    let isCart = await Cart.findOne({userId:user.email})
    console.log(isCart,'cart');
       var options = {
      amount: isCart.totalAfterDiscounts*100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: ""+orderid
    };
    instance.orders.create(options, function(err, order) {
    
     if(err){
       console.log(err,'status');
     }
     else{
       console.log('success');
      resolve(order)
     }
  
    });
    
  })
}
const verifyPayment=(data,user)=>{
  console.log(data,'data');
  return new Promise(async(resolve,reject)=>{
    const crypto = require('crypto')
    let hmac = crypto.createHmac('sha256','Zl8W6dg3CLH5AAW5D44rHrvs')
    hmac.update(data.payment.razorpay_order_id+'|'+data.payment.razorpay_payment_id)
hmac=hmac.digest("hex")
if(hmac==data.payment.razorpay_signature){
 await Cart.findOneAndDelete({userId:user.email})
 await Order.findOneAndUpdate({_id:data.order.response.receipt},{$set:{'product.$[].paid':'payment completed'}})
  resolve()
}else{
  reject()
}
  })
}

const priceFilter=(data)=>{
  return new Promise(async(resolve,reject)=>{
    let filterProducts = await Product.find({price:{$lt:data['price-max']}})
    resolve(filterProducts)
  })
}
const search=(data)=>{
  return new Promise(async(resolve,reject)=>{
    let search=data.search
    let products= await Product.find({'$or':[{productName:{$regex:search,$options:'i'}}]}).lean()
      resolve(products)
  })
}

const addProfile = (data,user)=>{
  return new Promise(async(resolve,reject)=>{
let isUser = await Model.findOne({email:user.email})
if (isUser){
  await Model.findOneAndUpdate({email:user.email},{
    fName:data.fName,
    lName:data.lName,
    phone:data.phone,    
    userAddress:{status:data.home,address:data.address,town:data.town,postCode:data.postCode,state:data.state,education:data.education,country:data.country},
  },{upsert:true})

  let isAddress = await Address.findOne({ userId: user.email });
  if (isAddress) {
    await Address.findOneAndUpdate(
      { userId: user.email },
      {
        $push: {

          address1: {
            fName: data.fName,
            lName: data.lName,
            companyName: data.company,
            country: data.country,
            address: data.address,
            town: data.town,
            state: data.state,
            postCode: data.postCode,
            phone: data.phone,
            status:data.home
          },
        },
      }
    );
    resolve();
  } else {
    let newAddress = await Address({
      userId: user.email,
      address1: {
        fName: data.fName,
        lName: data.lName,
        companyName: data.company,
        country: data.country,
        address: data.address,
        town: data.town,
        state: data.state,
        postCode: data.postCode,
        phone: data.phone,
        status:data.home
      },
    });
    await newAddress.save((err, data) => {
      if (err) {
        console.log(err);
        reject();
      }
      resolve();
    });
  }



  resolve()
}
  })
}

const viewOrder=(id)=>{
  return new Promise(async(resolve,reject)=>{
      // let orderDeteils= await Order.find({userId:id}).lean()
      let products = await Order.find({userId:id}).sort({created:-1}).lean()
      console.log(products);
     resolve(products)
  })
}
const cancelOrder= (id,user)=>{
  return new Promise(async(resolve,reject)=>{
    console.log(id,'id');
    let userOrder = await Order.findOne({userId:user.email})
    console.log(userOrder);
    userOrder.product.forEach(async(e,i)=>{
    await Product.findOneAndUpdate({_id:e.productId},{ $inc: { stock: +e.quantity }})
    })
  await Order.findOneAndUpdate({userId:user.email,'product._id':id},{$set:{'product.$.status':'order canceled'}})
  await Order.findOneAndUpdate({userId:user.email,'product._id':id},{$set:{'product.$.active':'false'}})

  resolve({status:true})
  })
}
const sortOrder=(id)=>{
  return new Promise(async(resolve,reject)=>{
      let orderDeteils= await Order.findOne({userId:id}).sort({_id:-1}).lean()
      console.log(orderDeteils,'deteils');
     resolve(orderDeteils)
  })
}

const getSingleProduct=(id,user)=>{
  return new Promise(async(resolve,reject)=>{
    let singleProduct = await Order.findOne({userId:user.email, "product._id": id }).lean()
    resolve(singleProduct)
  })
}

const deleteOrder=(id,user)=>{
  return new Promise(async(resolve,reject)=>{
    let ifOrders = await Order.findOne({userId:user.email}, { product: { $elemMatch: { _id:id } } })
    await Order.update(
      { userId: user.email },
      { $pull: { product: { _id: id } } }
    );
  if(!ifOrders.product.length){
    console.log('success');
    await Order.deleteOne({_id : ifOrders._id})
    resolve()
  }else{
    console.log('error');
    resolve()
  }
  })
}

const paymentFailed = (data)=>{
  console.log('function');
  console.log(data.order.response.receipt,'data reciept');
  return new Promise(async(resolve,reject)=>{
    await Order.findOneAndUpdate({_id:data.order.response.receipt},{$set:{'product.$[].paid':'payment failed'}})
    await Order.findOneAndUpdate({_id:data.order.response.receipt},{$set:{'product.$[].status':'payment failed'}})
    resolve()
  })

}

const addProfileImg=(img1,user)=>{
  return new Promise(async(resolve,reject)=>{
      let isUser = await Model.findOneAndUpdate({userId:user.email},{$set:{profileImg:img1}})
      console.log(isUser,'userimg');
      resolve()
  })
}

const searchFilter=(data)=>{
  return new Promise(async (resolve, reject) => {
    let {brand,category,Prize} = data
    console.log(brand,'brand');
    console.log(category,'category');
    console.log(Prize,'p');
    let result=[]

    if(brand.length>0 && category.length>0  ){
         result = await Product.find({$or:[{brand:brand},{category:category},{price:{$lt:Prize}}]}).lean()
    } 

    else if(brand.length>0 && category.length==0  ){
result = await Product.find({$or:[{brand:brand},{price:{$lt:Prize}}]}).lean()
    }
    else if(brand.length==0 && category.length>0 )
    result = await Product.find({$or:[{category:category},{price:{$lt:Prize}}]}).lean()
    else{
       result = await Product.find({price:{$lt:Prize}}).lean()
    }
    resolve(result)
})
}

const productReview = (data,user) => {
  console.log(data,'datas');
  return new Promise(async(resolve,reject)=>{
    let isUser = await Model.findOne({userId:user.email})
    console.log(isUser,'user');
   let products =  await Product.findOneAndUpdate({_id:data.id},{$push:{review:{userId:user.email,Review:data.review,fName:isUser.fName,rating:data.rating}}})
   console.log(products,'producy');
     await Model.findOneAndUpdate({userId:user.email},{$push:{review:{productId:data.id,Review:data.review}}})
     resolve()
  })
}
const deleteAddress=(id,user)=>{
  console.log(id,'id');
return new Promise(async(resolve,reject)=>{
  await Address.findOneAndDelete({userId:user.email},{$pull:{'address1.$._id':id}})
  resolve()
})
}

module.exports = {
  deleteAddress,
  productReview,
  searchFilter,
  addProfileImg,
  checkStock,
  paymentFailed,
  deleteOrder,
  getSingleProduct,
  sortOrder,
  cancelOrder,
  viewOrder,
  addProfile,
  search,
  priceFilter,
  verifyPayment,
  generateRazor,
  placeOrder,
  findAddress,
  addAddress,
  getAddress,
  cartIn,
  findBrand,
  findDiscount,
  findCategory,
  getCategory,
  deleteWishlist,
  getWishlistCount,
  getAllWishlist,
  addToWishList,
  getCoupon,
  checkCoupon,
  getBrand,
  getfunction,
  subTotal,
  totalAmount,
  firstTwo,
  addProductCount,
  deleteCart,
  decProduct,
  getCartCount,
  productDetails,
  doSignup,
  getCartItems,
  addingToCart,
  userLogin,
  getAccount,
  forgotpass,
  otpVerify,
  newPass,
  settingPassword,
  registeringUser,
  reSend,
  productDetail,
};
