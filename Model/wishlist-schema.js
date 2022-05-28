const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
 
userId:{
    type:String,
    required:true
},
product:[
    {
     type:mongoose.Schema.Types.ObjectId,
     ref:'Product'
    }
]
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;