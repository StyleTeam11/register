import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { vapi, startAssistant, stopAssistant } from "./ai";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    country: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const navigate = useNavigate();

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speak("You are about to create an account.");

    const handleMessage = (message) => {
      if (message.role === "assistant" && message.content) {
        speak(message.content);
      }
    };

    const handleCallStart = () => {
      console.log("Call started");
      speak("Assistant is ready to help you.");
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setIsAssistantActive(false);
    };

    vapi.on("message", handleMessage);
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);

    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
    };
  }, []);

  const toggleAssistant = async () => {
    try {
      if (isAssistantActive) {
        await stopAssistant();
        speak("Assistant turned off");
      } else {
        await startAssistant();
        speak("Assistant is ready.");
      }
      setIsAssistantActive(!isAssistantActive);
    } catch (error) {
      console.error("Error toggling assistant:", error);
      speak("Error connecting to assistant. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      if (response.data.success) {
        const successMessage = "Account created successfully! Please login with your username and password.";
        setMessage(successMessage);
        speak(successMessage);
        setFormData({
          username: "",
          country: "",
          phone: "",
          password: "",
        });
        setTimeout(() => {
          window.speechSynthesis.cancel();
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred during registration.";
      setMessage(errorMessage);
      speak(errorMessage);
    }
  };

  const handleNavigateToLogin = () => {
    window.speechSynthesis.cancel();
    if (isAssistantActive) {
      stopAssistant().finally(() => navigate("/"));
    } else {
      navigate("/");
    }
  };

  return (
    <div className="registration-container">
      <div className="form-container">
        <h2>Create an Account</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
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
          <button type="submit">Register</button>
          <button
            onClick={toggleAssistant}
            className={`assistant-btn ${isAssistantActive ? "active" : ""}`}
          >
            {isAssistantActive ? "Stop Assistant" : "Start Assistant"}
          </button>
          <button 
            type="button"
            onClick={handleNavigateToLogin}
            className="register-btn"
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
