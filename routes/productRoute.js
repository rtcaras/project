// routes/productRoute.js

const express = require('express');
const { createProduct, 
    getaProduct, 
    getallProduct, 
    updateProduct, 
    deleteProduct } = require('../controllers/productCtrl');

const router = express.Router();

router.post('/', createProduct);
router.get('/:id', getaProduct);
router.get('/', getallProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
