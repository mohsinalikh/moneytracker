const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_STRING);
    console.log("connect db successfully");
  } catch (error) {
    console.log(error);
  }
};



module.exports = connectDB;