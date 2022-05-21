const mongoose = require('mongoose');
const { array } = require('../uploadMiddleware/multer');

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    stock:{
      type:String,
      required:true,
      
    },
    description:{
        type:String,
        required:true,
        
    },
    category:{
        type:String,
        required:true
    },
   
    brand:{
        type:String,
        required:true
    },
    shippingCost:{
        type:String,
    },
    discount:{
        type:String,
    },
    os:{
        type:String,
        required:true
    },
    processor:{
        type:String,
        required:true
    },
    memory:{
        type:String,
        required:true
    }, 
    hardDrive:{
        type:String,
        require:true
    },
    color:{
        type:String,
        required:true
    },
    images:{type: Array}
    
})



const Product = mongoose.model("Product", productSchema);
module.exports=Product