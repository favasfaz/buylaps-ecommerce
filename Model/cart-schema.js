const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
 
userId:{
    type:String,
    required:true
},
product:[{
    productId:mongoose.Types.ObjectId,
    quantity:Number,
    name:String,
    price:Number,
    brand:String,
    total:Number,
    shippingCost:Number,
    discount:Number,
    stock:Number,
    image:{
        type:String
    },
    stockLess:{
        type:Boolean,
        default:false
    }
  
}],
total:{
    type:Number,
    required:true
},
shippingCost:{
    type:Number,
    default:0
},
    discount:{
      type:  Number,
      default:0,
    },
        couponDiscount:{
            type:Number,
            default:0
        },
     
    
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;