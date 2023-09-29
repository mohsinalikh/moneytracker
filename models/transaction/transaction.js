const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paidBy: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
  },
});

module.exports = mongoose.model("transaction", transactionSchema);
