import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setError('');
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/cart',
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart!');
      navigate('/cart');
    } catch (err) {
      alert('Failed to add to cart. Try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">₹{product.price}</p>
          <p className="text-sm text-gray-500 mb-6">In Stock: {product.stock}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addToCart}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;