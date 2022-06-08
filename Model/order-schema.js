const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
 
    userId:{
        type:String,
        required:true
    },

    cart:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cart'
    },
    orders:[{
        
        productId:{type:mongoose.Schema.Types.ObjectId,
            ref:'Product'},
        quantity:Number,
        total:Number,
        shippingCost:Number,
        discount:Number,
       
    }],
    address:{
        type: Object,
            fName:String,
            state:String,
            streetAddress:String,
            town:String,
            postCode:Number,
            paymentMethod:String
    },
   
    totalAmount:{
        type:Number,   
    },
    created:{
        type:Date,
        default:Date.now()
        },
        status:{
            type:String,
            default:'pending'
        },
         shippingCost:Number,
        discount:Number,
        couponDiscount:Number
  
});

const order = mongoose.model("order", orderSchema);

module.exports = order;