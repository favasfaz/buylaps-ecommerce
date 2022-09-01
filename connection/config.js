
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
   console.log("mongoose is connected");
  })
  .catch((error) => {
    console.log(error);
  });