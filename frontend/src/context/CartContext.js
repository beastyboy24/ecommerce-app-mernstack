// frontend/src/context/CartContext.js
const removeFromCart = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`/api/cart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart(res.data);
    setCartCount(res.data.items.reduce((sum, i) => sum + i.quantity, 0));
  } catch (err) {
    console.error(err);
  }
};

// Add to Provider value
<CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}></CartContext.Provider>