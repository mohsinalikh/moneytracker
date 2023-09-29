const mongoose = require("mongoose");
const { Schema } = mongoose;

const assetsSchema = new Schema({
  saving: {
    type: Number,
    required: true,
  },
  bank: {
    type: Number,
    required: true,
  },
  cash: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
  },
},);

module.exports = mongoose.model("Assets", assetsSchema);
