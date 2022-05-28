const mongoose = require('mongoose')
const moment =require('moment')
const couponCodeSchema = new mongoose.Schema({
    couponCodeName: {
        type: String,
        min: 5,
        max: 15,
        trim: true,
        required: true,
    },
    couponCode:{
    
        type:String,
        unique:true,
        required:true,
       
    },
  
    discount: {
        type: String,
    },
    discountStatus: {
        type: Boolean,
        default:true
    },
        limit:{
            type:Number,
            required:true
        },
    createdAt: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
    },
    updatedAt: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
    },
    expirationTime: {
        type: String,
        default: moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
        required: true,
    },
    usedUsers:{
        type:Array
    }
});

const coupon = mongoose.model("coupon", couponCodeSchema);

module.exports = coupon;