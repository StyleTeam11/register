import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const DeletePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
    speak("You are about to delete your account. Please enter your username and password.");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginResponse = await axios.post('http://localhost:5000/api/login', { username, password });
      if (loginResponse.data.success) {
        setOpenDialog(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
      speak("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const userResponse = await axios.get(`http://localhost:5000/api/users?username=${username}`);
      if (!userResponse.data) {
        speak("User not found");
        throw new Error('User not found');
      }
      
      const deleteResponse = await axios.delete(`http://localhost:5000/api/users/${userResponse.data._id}`);
      if (deleteResponse.data.success) {
        localStorage.removeItem('user');
        speak("Account deleted successfully");
        navigate('/login');
      }
    } catch (err) {
      speak("Account deletion failed");
      setError(err.response?.data?.error || 'Account deletion failed');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    navigate(-1);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Delete Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          fullWidth
          margin="normal"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading || !username || !password}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {loading ? 'Verifying...' : 'Delete Account'}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleBack}
          sx={{ mt: 1, mb: 2 }}
        >
          Back
        </Button>
      </form>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeletePage;