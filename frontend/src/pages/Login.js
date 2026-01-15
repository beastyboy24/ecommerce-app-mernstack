import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login Form Data:', formData);
    try {
      const response = await axios.post('/api/users/login', formData);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message;
      console.error('Login Error:', { status: err.response?.status, message: errorMsg });
      setError(errorMsg || 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h1>
      {error && <p className="text-red-500 mb-6 text-center font-medium">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          Login
        </motion.button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-medium hover:underline">
          Register
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;