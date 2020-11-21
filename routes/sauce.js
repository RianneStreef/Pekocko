const express = require("express");
const router = express.Router();

// const sauceCtrl = require("../controllers/sauce");

router.get("/", sauceCtrl.getAllSauces);
router.get("/:id", sauceCtrl.getOneSauce);
router.post("/", sauceCtrl.createSauce);
router.put("/:id", sauceCtrl.modifySauce);
router.delete("/:id", sauceCtrl.deleteSauce);
router.post("/:id/like", sauceCtrl.likeSauce);

//names of functions (getAllStuff etc)

module.exports = router;
