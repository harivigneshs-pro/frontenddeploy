import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { userInfo, logout } = useAuth(); // ✅ Corrected

  return (
    <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> | <Link to="/cart">Cart</Link>{" "}
      {userInfo ? (
        <>
          | <Link to="/orders">My Orders</Link> |{" "}
          <span>
            Hello, {userInfo.name}{" "}
            <button
              onClick={logout}
              style={{
                marginLeft: "5px",
                padding: "3px 6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </span>
        </>
      ) : (
        <>
          | <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </>
      )}
    </header>
  );
};

export default Header;
