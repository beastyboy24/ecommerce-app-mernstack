import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
      setWishlistCount(res.data.length);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    }
  };

  // Toggle wishlist (add/remove)
  const toggleWishlist = async (productId) => {
    if (!user) {
      alert('Please login to use wishlist');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/wishlist', { productId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
      setWishlistCount(res.data.length);
    } catch (err) {
      console.error('Toggle wishlist error:', err);
    }
  };

  // REMOVE FROM WISHLIST — THIS WAS MISSING
  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
      setWishlistCount(res.data.length);
    } catch (err) {
      console.error('Remove from wishlist error:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        toggleWishlist,
        removeFromWishlist, // ← ADDED THIS
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);