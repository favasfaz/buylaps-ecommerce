const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
 
  email:{
      type: String,
      required:true,
      unique:true
  },
  password:{
type:String,
required:true,
},
otpcode:{
  type:String,
  default:0
}
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;