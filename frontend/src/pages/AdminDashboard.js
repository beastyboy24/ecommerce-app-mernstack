import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', price: '', stock: '', image: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      axios.get('/api/products').then((response) => {
        setProducts(response.data);
      }).catch(err => {
        console.error('Fetch Products Error:', err);
        setError('Failed to load products');
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([...products, response.data]);
      setSuccess('Product added successfully');
      setFormData({ title: '', category: '', description: '', price: '', stock: '', image: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message;
      console.error('Add Product Error:', { status: err.response?.status, message: errorMsg });
      setError(errorMsg || 'Failed to add product');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container mx-auto p-4 text-center text-red-500">Access Denied</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Product</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-700 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
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
          Add Product
        </motion.button>
      </form>
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Existing Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                console.log('Image failed:', product.title, product.image);
              }}
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-800">{product.title}</h3>
              <p className="text-gray-600 line-clamp-2">{product.description}</p>
              <p className="text-primary font-bold">₹{product.price}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;