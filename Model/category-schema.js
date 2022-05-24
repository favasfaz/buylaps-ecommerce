const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
 
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

const category = mongoose.model("category", categorySchema);

module.exports = category;