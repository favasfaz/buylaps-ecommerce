const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
 
 name:{
     type:String,
     required:true
 },
 

 create :{
type:Date,
default:Date.now
},
status:{
    type:Boolean,
    default:true
}

});

const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;