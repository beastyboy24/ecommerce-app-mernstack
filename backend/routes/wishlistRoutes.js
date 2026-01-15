const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');

// GET wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
      await wishlist.save();
    }
    res.json(wishlist.products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// TOGGLE wishlist (add/remove)
router.post('/', auth, async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    const index = wishlist.products.findIndex(p => p.toString() === productId);
    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    const populated = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(populated.products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE FROM WISHLIST — THIS WAS MISSING
router.delete('/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ msg: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      p => p.toString() !== req.params.productId
    );

    await wishlist.save();
    const populated = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(populated.products);
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ msg: 'Failed to remove from wishlist' });
  }
});

module.exports = router;