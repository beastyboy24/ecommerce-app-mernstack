const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { productId, quantity, price } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};