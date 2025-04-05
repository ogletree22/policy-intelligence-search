import React, { useState } from 'react';
import './LoginPage.css';
import piLogo from '../assets/PI_Logo_2024.png';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement authentication logic here
    if (email === 'nacaa_spring_2025@4cleanair.org' && password === 'PI2025') {
      onLogin(true); // Simulate successful login
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={piLogo} alt="Policy Intelligence Logo" className="login-logo-image" />
        <p className="login-logo-subtitle">Login into your account</p>
        <p className="login-logo-subtitle">Access to policy & guidance documents</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-form-input"
        />
        <button type="submit" className="login-form-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage; 