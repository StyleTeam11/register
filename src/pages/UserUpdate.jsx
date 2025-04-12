import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Typography, Container,
  Paper, Alert, CircularProgress
} from '@mui/material';
import "../update.css";

const UserUpdate = () => {
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userFetched, setUserFetched] = useState(false);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speak("You are about to update your account. Please enter your username");
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.get(`http://localhost:5000/api/users?username=${username}`);
      if (response.data) {
        setCountry(response.data.country || '');
        setPhone(response.data.phone || '');
        setUserFetched(true);
        speak("User found. Please update your details.");
      } else {
        speak("User not found");
        throw new Error('User not found');
      }
    } catch (err) {
      speak("You are not found!");
      setError(err.response?.data?.error || 'fail to fetch your details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const userId = (await axios.get(`http://localhost:5000/api/users?username=${username}`)).data._id;
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, {
        username,
        country,
        phone,
        password
      });
      if (response.data.success) {
        setSuccess('Your account updated successfully!');
        speak("Your account updated successfully!");
        setPassword('');
      } else {
        speak("Failed to update your account");
        throw new Error('Failed to update your account');
      }
    } catch (err) {
      speak("fail to updating your details");
      setError(err.response?.data?.error || 'fail to updating your details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="update-container" sx={{ mt: 8 }}>
      
        <Typography variant="h4" component="h1" className="update-title" gutterBottom align="center">
          Update Account
        </Typography>

        {error && (
          <Alert severity="error" className="update-alert" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className="update-success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

          {!userFetched ? (
            <Box component="form" className="update-form" onSubmit={(e) => { e.preventDefault(); fetchUserDetails(); }}>
              <TextField
                className="update-input"
                InputLabelProps={{ className: "update-input-label" }}
                fullWidth
                margin="normal"
                label="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Button
                className="update-button"
                fullWidth
                variant="contained"
                disabled={loading || !username}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                type="submit"
              >
                {loading ? <CircularProgress size={24} className="update-spinner" /> : 'Fetch Account Details'}
              </Button>
               <Button    
                            className="delete-dialog-confirm"
                            variant="contained"
                            disabled={loading}
                          >
                            Back
                          </Button>
            </Box>
          ) : (
            <Box component="form" className="update-form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <TextField
                className="update-input"
                InputLabelProps={{ className: "update-input-label" }}
                fullWidth
                margin="normal"
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <TextField
                className="update-input"
                InputLabelProps={{ className: "update-input-label" }}
                fullWidth
                margin="normal"
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                className="update-input"
                InputLabelProps={{ className: "update-input-label" }}
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="update-button"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                type="submit"
              >
                {loading ? <CircularProgress size={24} className="update-spinner" /> : 'Update Details'}
              </Button>
            </Box>
          )}
       
     
    </Container>
  );
};

export default UserUpdate;