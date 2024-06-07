const express = require("express");
const { createProduct, getaProduct } = require("../controllers/productCtrl");
const router = express.Router();


router.post("/", createProduct);

router.get("/:id", getaProduct);

module.exports = router;