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
    image:{
        type:String
    }
}],
total:{
    type:Number,
    required:true
}

});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;