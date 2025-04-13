import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSpokenPassword, setHasSpokenPassword] = useState(false);
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
    speak("Please enter your username to get your password.");
  }, []);

  // Speak password when it's retrieved
  useEffect(() => {
    if (password && !hasSpokenPassword) {
      speak(`Your password is ${password}`);
      setHasSpokenPassword(true);
    }
  }, [password, hasSpokenPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setPassword('');
    setHasSpokenPassword(false);
    
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { username });
      
      if (response.data.success) {
        setPassword(response.data.password);
        const successMessage = "Your password has been retrieved successfully";
        setMessage(successMessage);
        speak(successMessage);
      } else {
        throw new Error(response.data.error || 'Failed to retrieve password');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Password retrieval failed';
      setError(errorMessage);
      speak(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    navigate(-1);
  };

  const handleSpeakPassword = () => {
    if (password) {
      speak(`Your password is ${password}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Forgot Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || !username.trim()}
            sx={{ mt: 2, mb: 1 }}
          >
            {loading ? 'Retrieving...' : 'Retrieve Password'}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleBack}
            sx={{ mt: 1, mb: 2 }}
          >
            Back
          </Button>
        </Box>

        {password && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Your Password:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
              {password}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSpeakPassword}
              sx={{ mb: 2 }}
            >
              Speak Password Again
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                window.speechSynthesis.cancel();
                navigate('/login');
              }}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;