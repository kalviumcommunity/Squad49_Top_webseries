// LoginPage.jsx

import React, { useState } from 'react';
import './LoginPage.css'; // Import login page CSS

const LoginPage = ({ onLogin, onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false); // State to toggle sign-up form visibility

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // You can add authentication logic here
    // For simplicity, let's just call the onLogin prop with the username
    onLogin(username);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // You can add sign-up logic here
    // For simplicity, let's just call the onSignUp prop with the sign-up information
    onSignUp({ username, email, password });
  };

  const toggleSignUpForm = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="or-text">OR</div>
      <div className="signup-option">
        <p>Don't have an account? <button onClick={toggleSignUpForm}>Sign Up</button></p>
      </div>
      {showSignUp && (
        <div>
          <h2>Sign Up</h2>
          <form className="signup-form" onSubmit={handleSignUpSubmit}>
            <div>
              <label>Username:</label>
              <input type="text" value={username} onChange={handleUsernameChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={handleEmailChange} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" value={password} onChange={handlePasswordChange} />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
