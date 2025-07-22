const express = require("express");
const router = express.Router();
const { autoFillProduct } = require("../controllers/autoFillController");

router.post("/auto-fill-product", autoFillProduct);

module.exports = router;
