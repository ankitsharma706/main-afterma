import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const itemIndex = prev.findIndex((i) => i.id === id);
      if (itemIndex === -1) return prev;
      
      const newQty = prev[itemIndex].quantity + delta;
      
      // If quantity drops to less than 1, remove the item entirely
      if (newQty < 1) {
        return prev.filter((i) => i.id !== id);
      }
      
      const newCart = [...prev];
      newCart[itemIndex] = { ...newCart[itemIndex], quantity: newQty };
      return newCart;
    });
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, cartSubtotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
