const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://favasfaz:19thapril@cluster0.jybve.mongodb.net/shoppingcart?retryWrites=true&w=majority", {
    useNewUrlParser: true,
})

mongoose.connection.on("error", err => {
  console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
    console.log('mongoose is connected');
})   