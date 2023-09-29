const assets = require("../../models/assets/assets");
const Assets = require("../../models/assets/assets");
const Transactions = require("../../models/transaction/transaction");

const getTransaction = async (req, res) => {
  const { userId } = req.user;
  const transaction = await Transactions.find({ userId });
  return res.status(200).json({
    success: true,
    data: transaction,
  });
};

const postTransaction = async (req, res) => {
  try {
    const { amount, description, paidBy } = req.body;
    const { userId } = req.user;

    if (!amount || !description || !paidBy) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userAssets = await Assets.findOne({ userId });
    if (!userAssets) {
      return res.status(404).json({
        success: false,
        message: "User assets not found",
      });
    }

    let updateAssets = userAssets;
    if (paidBy === "bank") {
      const newBankBalance = eval(Number(userAssets.bank) - Number(amount));
      updateAssets = await Assets.findOneAndUpdate(
        { userId },
        { bank: newBankBalance },
        { new: true }
      );
    } else if (paidBy === "cash") {
      const newCashBalance = Number(userAssets.cash) - Number(amount);
      updateAssets = await Assets.findOneAndUpdate(
        { userId },
        { cash: newCashBalance },
        { new: true }
      );
    } else if (paidBy === "saving") {
      const newSavingBalance = Number(userAssets.saving) - Number(amount);
      updateAssets = await Assets.findOneAndUpdate(
        { userId },
        { saving: newSavingBalance },
        { new: true }
      );
    }

    if (!updateAssets) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user assets",
      });
    }

    // Create a new transaction
    const transaction = await Transactions.create({
      amount,
      description,
      paidBy,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction.toObject(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { amount, description, paidBy, _id } = req.body;
    const { userId } = req.user;

    const userAssets = await Assets.findOne({
      userId,
    });
    const userTransaction = await Transactions.findOne({
      userId,
      _id,
    });

    if (!userAssets) {
      return res.status(404).json({
        success: false,
        message: "User assets not found.",
      });
    }

    let updateAssets = userAssets;
    if (paidBy === "saving") {
      const newSaving =
        Number(userAssets.saving) +
        Number(userTransaction.amount) -
        Number(amount);
      updateAssets = await Assets.findOneAndUpdate(
        { userId },
        {
          $set: {
            saving: newSaving,
          },
        },
        { new: true }
      );
    }
    if (paidBy === "bank") {
      const newBank =
        Number(userAssets.bank) +
        Number(userTransaction.amount) -
        Number(amount);
      updateAssets = await Assets.findOneAndUpdate(
        { userId },
        {
          $set: {
            bank: newBank,
          },
        },
        { new: true }
      );
    }
    if (paidBy === "cash") {
      const newCash =
        Number(userAssets.cash) +
        Number(userTransaction.amount) -
        Number(amount);
      updateAssets = await Assets.findOneAndUpdate(
        { userId },
        {
          $set: {
            cash: newCash,
          },
        },
        { new: true }
      );
    }

    if (!updateAssets) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user assets.",
      });
    }

    const updatedTransaction = await Transactions.findOneAndUpdate(
      {
        userId,
        _id,
      },
      {
        $set: {
          amount,
          description,
          paidBy,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedTransaction) {
      return res.status(500).json({
        success: false,
        message: "Failed to update transaction.",
      });
    }

    res.status(200).json({
      data: updatedTransaction.toObject(),
      success: true,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { amount, paidBy, _id } = req.body;
    const { userId } = req.user;

    const UsersAssets = await Assets.findOne({ userId });

    let updateField = {};

    if (paidBy === "bank") {
      updateField.bank = UsersAssets.bank + Number(amount);
    } else if (paidBy === "saving") {
      updateField.saving = UsersAssets.saving + Number(amount);
    } else {
      updateField.cash = UsersAssets.cash + Number(amount);
    }

    const updateAssets = await Assets.findOneAndUpdate(
      { userId },
      { $set: updateField },
      { new: true }
    );

    await Transactions.findOneAndDelete({ userId, _id });

    return res.json({
      success: true,
      message: "transaction deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

module.exports = {
  getTransaction,
  postTransaction,
  updateTransaction,
  deleteTransaction,
};
