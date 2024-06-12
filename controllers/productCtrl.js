const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title, category, brand, description, price, quantity, color } = req.body;

        if (title) {
            req.body.slug = slugify(title);
        }

        const newProduct = await Product.create({
            title,
            category,
            brand,
            description,
            price,
            quantity,
            color,
            slug: req.body.slug
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        } 

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a Single Product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(findProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Products
const getallProduct = asyncHandler(async (req, res) => {
    try {
        const getallProducts = await Product.find(req.query);
        res.json(getallProducts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = { 
    createProduct, 
    getaProduct, 
    getallProduct, 
    updateProduct,
    deleteProduct 
};
