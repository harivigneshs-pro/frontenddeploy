import { useCart } from "../context/CartContext";

const ProductScreen = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
};
export default ProductScreen;