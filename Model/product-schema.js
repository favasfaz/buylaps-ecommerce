const mongoose = require('mongoose');

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
      type:Number,
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
        type:Number,
    },
    discount:{
        type:Number,
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
    discountedPrice:{
        type:Number,
    },
    images:
    {type: Array},

     create :{
  type:Date,
  default:Date.now
},
stockLess:{
    type:Boolean,
    default:false
},
review:{
    type:Array,
    userId:String,
    Review:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    fName:String,
    rating:Number
}
    
})

productSchema.index({productName:'text'})

const Product = mongoose.model("Product", productSchema);
module.exports=Product