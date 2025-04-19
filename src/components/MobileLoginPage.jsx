import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileLoginPage.css';
import piLogo from '../assets/PI_Logo_2024.png';
import { AuthContext } from '../context/AuthContext';

const MobileLoginPage = () => {
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
    <form onSubmit={handleSubmit}>
      <h1>Verify Your Email</h1>
      <p className="confirmation-text">Please enter the verification code sent to your email.</p>
      <div className="input-group">
        <input
          type="text"
          placeholder="Verification Code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="login-button">Verify Account</button>
    </form>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
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
          required
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            required
          />
        </div>
      )}
      <button type="submit" className="login-button">
        {isLogin ? 'Login' : 'Sign up'}
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
    <div className="mobile-login">
      <div className="login-content">
        <img src={piLogo} alt="Policy Intelligence Logo" className="login-logo" />
        <h1>{isLogin ? 'Login to your account' : 'Create your account'}</h1>
        <p className="subtitle">Access to policy & guidance documents</p>
        {showConfirmation ? renderConfirmationForm() : renderForm()}
      </div>
    </div>
  );
};

export default MobileLoginPage; 