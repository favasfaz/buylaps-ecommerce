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
  type:String,
  default:0
},
create :{
  type:Date,
  default:Date.now
},
status:{
  type: Boolean,
  default:true
}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;