const {
  getTransaction,
  updateTransaction,
  postTransaction,
  deleteTransaction,
} = require("../../controllers/transaction/transaction");
const verifyToken = require("../../middleware/verifyToken");
const router = require("express").Router();

router.get("/transaction", verifyToken, getTransaction);
router.post("/transaction", verifyToken, postTransaction);
router.patch("/transaction", verifyToken, updateTransaction);
router.delete("/transaction", verifyToken, deleteTransaction);

module.exports = router;
