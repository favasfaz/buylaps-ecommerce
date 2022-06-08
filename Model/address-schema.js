var mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
 
  userId:{
      type:String,
      required:true
  },
  address1:[{
      fName:String,
      lName:String,
      companyName:String,
      country:String,
      address:String,
      town:String,
      state:String,
      postCode:Number,
      phone:Number,
      status:{
        type:Boolean,
        default:false,
      }
  }]
  
});

const Address = mongoose.model("address", addressSchema);

module.exports = Address;