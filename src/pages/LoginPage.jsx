import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
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
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid username or password.";
      setMessage(errorMessage);
      speak(errorMessage);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    speak("Please enter your username to recover your password.");
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotUsername.trim()) {
      speak("Username cannot be empty");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        username: forgotUsername,
      });

      if (response.data.success) {
        const passwordMessage = `Your password is ${response.data.password}. Please keep it secure.`;
        speak(passwordMessage);
      } else {
        speak(response.data.error || "Could not retrieve password");
      }
    } catch (error) {
      speak("Error retrieving password. Please try again.");
    } finally {
      setShowForgotPassword(false);
      setForgotUsername("");
    }
  };

  const handleNavigateToRegister = () => {
    window.speechSynthesis.cancel();
    if (isAssistantActive) {
      stopAssistant().finally(() => navigate("/register"));
    } else {
      navigate("/register");
    }
  };

  const handleNavigateToForgotPassword = () => {
    window.speechSynthesis.cancel();
    if (isAssistantActive) {
      stopAssistant().finally(() => navigate("/forgot-password"));
    } else {
      navigate("/forgot-password");
    }
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

        {showForgotPassword && (
          <div className="forgot-password-popup">
            <h3>Password Recovery</h3>
            <input
              type="text"
              placeholder="Enter your username"
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleForgotPasswordSubmit}>Submit</button>
              <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
