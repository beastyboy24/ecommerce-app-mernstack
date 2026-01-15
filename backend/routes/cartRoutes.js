const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');

// GET CART
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error('Get Cart Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ADD TO CART
router.post('/', auth, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ msg: 'Product ID is required' });
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    // IF NO CART → CREATE WITH USER ID
    if (!cart) {
      cart = new Cart({
        user: req.user.id,   // THIS LINE WAS MISSING
        items: []
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    const populated = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(populated);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ msg: 'Failed to add to cart' });
  }
});

module.exports = router;