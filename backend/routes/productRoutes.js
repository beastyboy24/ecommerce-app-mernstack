const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add new product (admin only)
router.post('/', auth, admin, async (req, res) => {
  const { title, category, description, price, stock, image } = req.body;

  console.log('Add Product Request:', req.body);

  if (!title || !category || !description || !price || !stock || !image) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const product = new Product({ title, category, description, price, stock, image });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Add Product Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;