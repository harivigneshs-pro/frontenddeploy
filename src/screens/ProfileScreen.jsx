import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios"; // Axios instance with token

const ProfileScreen = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

  // 🔹 Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // 🔹 Prevent rendering until login is confirmed
  if (!userInfo) return null;

  // 🔹 Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/profile"); // protected route
        setProfile(data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {profile.name || userInfo.name}</p>
      <p><strong>Email:</strong> {profile.email || userInfo.email}</p>
      <p><strong>Admin:</strong> {profile.isAdmin ? "Yes" : "No"}</p>
    </div>
  );
};

export default ProfileScreen;
