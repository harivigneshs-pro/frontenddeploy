import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [userInfo, navigate]);

  if (!userInfo) return null; // prevent flicker before redirect

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.qty,
    0
  );

  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      setLoading(true);

      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        qty: item.qty,
      }));

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        "https://mern-backend-co6f.onrender.com/api/orders",
        { orderItems, totalPrice },
        config
      );

      alert("✅ Order placed successfully!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Order failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              <p><strong>{item.product.name}</strong></p>
              <p>Price: ₹{item.product.price}</p>
              <button onClick={() => addToCart(item.product)}>+</button>
              <span style={{ margin: "0 10px" }}>{item.qty}</span>
              <button onClick={() => removeFromCart(item.product._id)}>-</button>
            </div>
          ))}
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
          <button onClick={placeOrder} disabled={loading || cartItems.length === 0}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default CartScreen;
