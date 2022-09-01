
const mongoose = require('mongoose');
require('dotenv').config() 

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
   console.log("mongoose is connected");
  })
  .catch((error) => {
    //console.log(process.env.MONGO_URL,"process.env.MONGO_URL");
    console.log(error);

  });