const { postAssets, getAssest, patchAsset } = require("../../controllers/assets/assets");
const verifyToken = require("../../middleware/verifyToken");
const router = require("express").Router();

router.get("/assets", verifyToken, getAssest);
router.post("/assets", verifyToken, postAssets);
router.patch("/assets", verifyToken, patchAsset);

module.exports = router;
