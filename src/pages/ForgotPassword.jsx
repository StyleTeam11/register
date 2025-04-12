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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setPassword('');
    
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

  return (
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Forgot Password
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
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
          >
            {loading ? 'Retrieving...' : 'Retrieve Password'}
          </Button>
        </Box>

        {password && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Password:
            </Typography>
            <Typography variant="body1">
              {password}
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
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