const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  lName:{
      type:String,
      required:true
  }
  ,
  email:{
      type: String,
      required:true,
      unique:true
  },
  password:{
type:String,
required:true,
bcrypt:true
},
otpcode:{
  type:Number,
  default:0
}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;