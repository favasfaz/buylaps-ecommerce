
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://favasfaz:19thapril@cluster0.jybve.mongodb.net/shoppingcart?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
   console.log("mongoose is connected");
  })
  .catch((error) => {
    console.log(error);
  });