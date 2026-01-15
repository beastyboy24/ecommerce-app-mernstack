import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-20">
        <HeartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-xl text-gray-600">Your wishlist is empty</p>
        <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <Link to={`/product/${product._id}`} className="block">
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                <p className="text-xl font-bold text-indigo-600 mt-2">₹{product.price}</p>
              </div>
            </Link>
            <div className="p-4 border-t flex gap-2">
              <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-1">
                <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;