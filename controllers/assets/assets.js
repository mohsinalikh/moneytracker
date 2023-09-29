const Assets = require("../../models/assets/assets");

const getAssest = async (req, res) => {
  const { userId } = req.user;

  try {
    const assets = await Assets.findOne({ userId });

    return res.status(201).json({
      success: true,
      message: "All assets are fetched successfully",
      data: {
        ...assets.toObject(),
        totalAssets:
          Number(assets.cash) + Number(assets.saving) + Number(assets.bank),
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const postAssets = async (req, res) => {
  const { bank, saving, cash } = req.body;
  const { userId } = req.user;

  try {
    if (!bank || !saving || !cash) {
      return res.status(400).json({
        success: false,
        message: "All assets are required",
      });
    }

    const asset = await Assets.create({
      saving,
      cash,
      bank,
      userId,
    });

    if (asset) {
      return res.status(201).json({
        success: true,
        message: "All assets are fetched successfully",
        data: {
          ...asset.toObject(),
          totalAssets:
            Number(asset.cash) + Number(asset.saving) + Number(asset.bank),
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const patchAsset = async (req, res) => {
  const { bank, saving, cash } = req.body;
  const { userId } = req.user;

  try {
    const updateAssets = await Assets.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: {
          bank,
          saving,
          cash,
        },
      },
      { new: true }
    );

    if (updateAssets) {
      return res.status(201).json({
        success: false,
        message: "Asset update successfully",
        data: {
          ...updateAssets.toObject(),
          totalAssets:
            Number(updateAssets.cash) +
            Number(updateAssets.saving) +
            Number(updateAssets.bank),
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  postAssets,
  getAssest,
  patchAsset,
};
