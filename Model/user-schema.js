const { type } = require("express/lib/response");
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
},
phone:{
  type:Number,
  required:true,
},
 
userAddress:{
  type:Object,
  address:String,
  postCode:Number,
  state:String,
  education:String,
  country:String,
  town:String,
  status:Boolean
}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;