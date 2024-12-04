import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import LoadingAnimation from "../../components/LoadingAnimation";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false); // New state for animation
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/user/login", { username, password });
            localStorage.setItem("token", response.data.token);

            const { firstName, lastName, username: userUsername, email, userType } =
                response.data.user;

            dispatch(
                setUser({
                    username: userUsername,
                    firstName,
                    lastName,
                    email,
                    type: userType,
                })
            );

            setShowAnimation(true); // Show the animation
            setTimeout(() => {
                if (userType === 2) {
                    navigate("/"); // Redirect to home page
                } else if (userType === 1) {
                    navigate("/admin/employees"); // Redirect to admin page
                }
            }, 3000); // Match animation duration
        } catch (err) {
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    if (showAnimation) {
        return <LoadingAnimation onComplete={() => setShowAnimation(false)} />;
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login to Cred</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <div className="additional-actions">
                    <button className="link-button" onClick={() => navigate("/signup")}>
                        Don't have an account? Sign Up
                    </button>
                    <button
                        className="link-button"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
