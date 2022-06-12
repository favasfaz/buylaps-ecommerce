const Mongoose = require("mongoose");

const orderSchema = new Mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  product: [
    {
      productId: Mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      brand: String,
      image: String,
      quantity: Number,
      subTotal: Number,
      paid: {
        type: String,
        default: "Not Paid",
      },
      status: {
        type: String,
        default: "Ordered",
      },
    
      deliverDate: {
        type: String,
        default: null,
      },
      paymentType: {
        type: String,
        required: true,
      },
      active:{
        type:Boolean,
        default:true
      }
    },
  ],
  address:{
      type:Object,
      fName:String,
      state:String,
        streetAddress:String,
      town:String,
      postCode:Number
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
  },
  created: {
    type:Date,
    default:Date.now()
  }
 
});

const orderModel = Mongoose.model("Orders", orderSchema);

module.exports = orderModel;