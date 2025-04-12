import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DeletePage from './pages/DeletePage.jsx';
import UserUpdate from './pages/UserUpdate.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import SettingAccount from './pages/SettingAccount.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/update" element={<UserUpdate />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/account" element={<SettingAccount/>} />
      </Routes>
    </Router>
  );
}

export default App;