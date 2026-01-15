import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart({ items: [] });
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCart(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center py-10">Loading cart...</p>;
  if (!user) return <p className="text-center py-10">Please login to view cart</p>;
  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Your cart is empty</p>
        <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item, index) => (
          <motion.div
            key={item.product._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={item.product.image}
              alt={item.product.title}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.product.title}</h3>
              <p className="text-sm text-gray-600">₹{item.product.price} × {item.quantity}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.product._id)}
              className="text-red-500 hover:text-red-700 transition p-2"
              title="Remove from cart"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;