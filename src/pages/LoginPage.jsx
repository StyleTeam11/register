import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speak("You are in login page. Please enter your username and password.");
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      if (response.data.success) {
        const successMessage = "Login successful! Redirecting to your account.";
        setMessage(successMessage);
        speak(successMessage);
        setTimeout(() => {
          window.speechSynthesis.cancel();
          window.location.href = "https://vigilentaids-six.vercel.app/home";
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid username or password.";
      setMessage(errorMessage);
      speak(errorMessage);
    }
  };

  const handleNavigateToRegister = () => {
    window.speechSynthesis.cancel();
    navigate("/register");
  };

  const handleNavigateToForgotPassword = () => {
    window.speechSynthesis.cancel();
    navigate("/forgot-password");
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2>VigilentAids</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="button-group">
            <button type="submit">Login</button>
            <button 
              type="button"
              onClick={handleNavigateToForgotPassword}
              className="forgot-password-btn"
            >
              Forgot Password?
            </button>
            <button 
              type="button"
              onClick={handleNavigateToRegister}
              className="register-btn"
            >
              Create New Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;