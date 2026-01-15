import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ address: '', paymentMethod: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for checkout logic
    navigate('/');
  };

  if (!user) {
    return <div className="container mx-auto p-4 text-center text-red-500">Please login to checkout</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Shipping Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Place Order
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Checkout;