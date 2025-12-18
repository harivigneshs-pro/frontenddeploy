import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import axios from "axios";

const CartContext = createContext();

// Axios instance with JWT token
const API = axios.create({
  baseURL: "https://mern-backend-co6f.onrender.com/api",
});
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("userInfo");
  if (storedUser) {
    const userInfo = JSON.parse(storedUser);
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // 🔹 Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (userInfo) {
        try {
          const { data } = await API.get("/cart");
          setCartItems(data.items || []);
        } catch (err) {
          console.error("Failed to fetch cart:", err.response?.data?.message || err.message);
        }
      } else {
        setCartItems([]); // clear cart on logout
      }
    };
    fetchCart();
  }, [userInfo]);

  // 🔹 Add item to cart
  const addToCart = async (product) => {
    try {
      const { data } = await API.post("/cart", { productId: product._id, qty: 1 });
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data?.message || err.message);
    }
  };

  // 🔹 Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to remove from cart:", err.response?.data?.message || err.message);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
