import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid'; // Filled heart
import { useWishlist } from '../context/WishlistContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // This reads the URL

  // Get search term from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.trim().toLowerCase() || '';

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/products');
        let filtered = res.data;

        // Filter by search
        if (searchQuery) {
          filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery)
          );
        }

        // Shuffle
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [location.search]); // Re-run when URL changes

  return (
    <>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-12 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
        >
          Welcome to <span className="text-yellow-300">ShopEasy</span>
        </motion.h1>
        <p className="mt-4 text-xl text-white opacity-90">
          {searchQuery ? `Results for: "${searchQuery}"` : 'Discover premium products'}
        </p>
        <SparklesIcon className="w-12 h-12 mx-auto mt-6 text-yellow-300 animate-pulse" />
      </motion.section>

      {/* No Results */}
      {!loading && searchQuery && products.length === 0 && (
        <p className="text-center text-gray-600 text-lg mb-8">
          No products found for "<strong>{searchQuery}</strong>"
        </p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array(8).fill().map((_, i) => <ShimmerCard key={i} />)
          : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
        }
      </div>
    </>
  );
};

// Shimmer Card
const ShimmerCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

// Product Card
const ProductCard = ({ product, index }) => {
  const { toggleWishlist, wishlist } = useWishlist();
  const isWishlisted = wishlist.some(p => p._id === product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white border-opacity-20 transition-all duration-300"
    >
      {/* Wishlist Heart */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product._id);
        }}
        className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:scale-110 transition z-10"
      >
        <HeartIcon
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? 'text-pink-500 fill-pink-500' : 'text-gray-400'
          }`}
        />
      </button>

      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            onError={e => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};



export default Home;