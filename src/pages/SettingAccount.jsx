import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';
import '../App.css';

const SettingAccount = () => {
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
    speak("You are about to set up your account. Update your Account or Delete your account");
  }, []);

  const handleNavigateToBack = () => {
    window.speechSynthesis.cancel();
    window.location.href = "https://vigilentaids-six.vercel.app/home";
  }; 

  return (
    <Container maxWidth="sm" className="settings-container">
      <Typography variant="h4" align="center" gutterBottom className="settings-title">
        My Account Settings
      </Typography>

      <Button
        variant="contained"
        fullWidth
        className="settings-button"
        onClick={() => {
          window.speechSynthesis.cancel();
          navigate('/update');
        }}
        sx={{ mb: 2 }}
      >
        Update My Account
      </Button>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        className="settings-button"
        onClick={() => {
          window.speechSynthesis.cancel();
          navigate('/delete');
        }}
        sx={{ mb: 2 }}
      >
        Delete My Account
      </Button>

      <Button 
        variant="outlined"
        fullWidth
        onClick={handleNavigateToBack}
        className="back-button"
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default SettingAccount;