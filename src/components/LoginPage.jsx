import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import piLogo from '../assets/PI_Logo_2024.png';
import appScreenshot from '../assets/app_screenshot.png';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { signIn, signUp, confirmSignUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (showConfirmation) {
        await confirmSignUp(email, confirmationCode);
        setShowConfirmation(false);
        setIsLogin(true);
        return;
      }

      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (!firstName.trim() || !lastName.trim()) {
          setError('First name and last name are required');
          return;
        }
        await signUp(email, password, {
          email,
          given_name: firstName.trim(),
          family_name: lastName.trim()
        });
        setShowConfirmation(true);
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  const renderConfirmationForm = () => (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Verify Your Email</h2>
      <p className="confirmation-text">Please enter the verification code sent to your email.</p>
      <input
        type="text"
        placeholder="Verification Code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        className="login-form-input"
        required
      />
      <button type="submit" className="login-form-button">Verify Account</button>
    </form>
  );

  const renderForm = () => (
    <form className="login-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {!isLogin && (
        <>
          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required={!isLogin}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required={!isLogin}
            />
          </div>
        </>
      )}
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-form-input"
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-form-input"
          required
        />
      </div>
      {!isLogin && (
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-form-input"
            required
          />
        </div>
      )}
      <button type="submit" className="login-form-button">
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <div className="auth-switch">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmPassword('');
          }}
          className="auth-switch-button"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="login-container">
      <div className="login-layout">
        <div className="app-preview">
          <img src={appScreenshot} alt="Policy Intelligence App Preview" className="app-screenshot" />
        </div>
        
        <div className="login-content">
          <div className="login-header">
            <img src={piLogo} alt="Policy Intelligence Logo" className="login-logo-image" />
            <p className="login-logo-subtitle">
              {showConfirmation ? 'Verify your account' : isLogin ? 'Login to your account' : 'Create an account'}
            </p>
            <p className="login-logo-subtitle">Access to policy & guidance documents</p>
          </div>
          
          {showConfirmation ? renderConfirmationForm() : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 