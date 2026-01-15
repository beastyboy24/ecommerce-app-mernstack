const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) return res.status(400).json({ msg: 'Cart empty' });
    const totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = new Order({
      user: req.user.id,
      items: cart.items,
      totalAmount
    });
    await order.save();
    cart.items = []; // Clear cart
    await cart.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};