import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useWishlist } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,  // Logout
  ArrowLeftEndOnRectangleIcon,     // Login
  UserPlusIcon,                    // Register
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon, SunIcon, MoonIcon
} from '@heroicons/react/24/outline';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
   const { wishlistCount } = useWishlist();
// Load saved theme
useEffect(() => {
  const saved = localStorage.getItem('darkMode') === 'true';
  setIsDark(saved);
  if (saved) document.documentElement.classList.add('dark');
}, []);

// Toggle function
const toggleDarkMode = () => {
  const newDark = !isDark;
  setIsDark(newDark);
  localStorage.setItem('darkMode', newDark);
  document.documentElement.classList.toggle('dark', newDark);
};
  const location = useLocation();
  
  // === CLEAR SEARCH ON PAGE CHANGE ===
useEffect(() => {
  if (location.pathname !== '/') {
    setSearchQuery('');
  }
}, [location.pathname]);
// === END ===
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  

const handleSearch = (e) => {
  if (e.key === 'Enter' && searchQuery.trim()) {
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  }
};
  
  

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          const count = data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
          setCartCount(count);
        } catch (err) {
          console.error('Cart count error:', err);
        }
      }
    };
    fetchCartCount();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Premium Header */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl z-50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-white text-indigo-600 px-2 py-1 rounded-lg text-xl">S</span>
            ShopEasy
          </Link>

         <ul className="flex items-center gap-4 text-sm font-medium flex-1 max-w-3xl mx-auto">
  {/* ====== SEARCH BAR ====== */}
  <li className="flex-1 relative">
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleSearch}
      className="w-full px-4 py-2 pl-10 bg-white bg-opacity-20 backdrop-blur-md text-white placeholder-white placeholder-opacity-70 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
    />
    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
    {searchQuery && (
      <button
        onClick={() => { setSearchQuery('');
          navigate('/');

        }}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-300"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    )}
  </li>
  {/* ====== DARK MODE TOGGLE ====== */}
<li>
  <button
    onClick={toggleDarkMode}
    className="p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 transition"
  >
    {isDark ? (
      <SunIcon className="w-5 h-5 text-yellow-300" />
    ) : (
      <MoonIcon className="w-5 h-5 text-gray-300" />
    )}
  </button>
</li>

  {/* ====== NAV LINKS (RIGHT SIDE) ====== */}
  <div className="flex items-center gap-4">
  <NavLink to="/" icon={<HomeIcon />}>Home</NavLink>
  
  {/* WISHLIST BUTTON */}
<li className="relative">
  <button
    onClick={() => navigate('/wishlist')}
    className="flex items-center gap-1 hover:text-pink-400 transition"
  >
    <HeartIcon className="w-5 h-5" />
    <span className="hidden sm:inline">Wishlist</span>
    {wishlistCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold">
        {wishlistCount}
      </span>
    )}
  </button>
</li>

  {/* CART BUTTON WITH BADGE */}
  <li className="relative">
    <button
      onClick={() => navigate('/cart')}
      className="flex items-center gap-1 hover:text-yellow-300 transition"
    >
      <ShoppingCartIcon className="w-5 h-5" />
      <span className="hidden sm:inline">Cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold">
          {cartCount}
        </span>
      )}
    </button>
  </li>

  <NavLink to="/checkout" icon={<CheckoutIcon />}>Checkout</NavLink>

    {user ? (
      <>
        <div className="flex items-center gap-2">
          <UserCircleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{user.name}</span>
        </div>
        {user.role === 'admin' && (
          <NavLink to="/admin" icon={<ShieldCheckIcon />}>Admin</NavLink>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 hover:text-pink-200 transition"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Logout
        </button>
      </>
    ) : (
      <>
        <NavLink to="/login" icon={<ArrowLeftEndOnRectangleIcon className="w-5 h-5" />}>Login</NavLink>
        <NavLink to="/register" icon={<UserPlusIcon className="w-5 h-5" />}>Register</NavLink>
      </>
    )}
  </div>
</ul>
  
    
          
   
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}

// Reusable Nav Link with Icon + Badge
const NavLink = ({ to, children, icon, badge }) => (
  <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link to={to} className="flex items-center gap-1 hover:text-yellow-300 transition relative">
      {icon}
      <span>{children}</span>
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  </motion.li>
);

// Footer
const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="bg-gradient-to-t from-gray-900 to-gray-800 text-white py-8 mt-auto"
  >
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} ShopEasy. Crafted with <span className="text-red-500">heart</span> by Professionals.</p>
    </div>
  </motion.footer>
);

// Icon Imports
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CheckoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;


export default function AppWrapper() {
  return (
    <AuthProvider>
      <WishlistProvider>
      <Router>
        <App />
      </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}