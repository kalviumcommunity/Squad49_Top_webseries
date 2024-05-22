import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleLoginUsernameChange = (e) => setLoginUsername(e.target.value);
  const handleLoginPasswordChange = (e) => setLoginPassword(e.target.value);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username: loginUsername, password: loginPassword });
      if (response.status === 200) {
        const { token } = response.data;
        onLogin(loginUsername, token);
      } else {
        console.error('Failed to login:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }
      const response = await axios.post('http://localhost:3000/register', { username, email, password });
      if (response.status === 201) {
        console.log('User registered successfully:', response.data);
        
      } else {
        console.error('Failed to sign up:', response.statusText);
      }
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const toggleSignUpForm = () => setShowSignUp(!showSignUp);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={loginUsername} onChange={handleLoginUsernameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={loginPassword} onChange={handleLoginPasswordChange} />
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
