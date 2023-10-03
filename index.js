require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database/connectDB");
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require("./routes/auth/auth");
const assetsRoutes = require("./routes/assets/assets");
const transactionRoutes = require("./routes/transaction/transaction");
const cors = require("cors");

connectDB();
app.use(
  express.json({
    urlencoded: true
  })
);
app.use(cors("*"));

app.get("/", (req, res) => {
  res.send("Welcome to the Moneytracker!");
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", assetsRoutes);
app.use("/api/v1", transactionRoutes);

app.listen(PORT, () => console.log("listening on port " + PORT));
