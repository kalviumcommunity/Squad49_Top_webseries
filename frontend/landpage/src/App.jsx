import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import AddEntityPage from './components/AddEntityPage';
import ShowInfo from './components/ShowInfo';

import './App.css';

const App = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setLoggedInUser(response.data.username);
          setSeriesData(response.data.seriesData);
        })
        .catch(error => {
          console.error(error.response.data);
          localStorage.removeItem('token');
          setLoggedInUser(null);
        });
    }
  }, []);

  const addWebSeries = (newSeries) => {
    setSeriesData([...seriesData, newSeries]);
  };

  const handleLogin = (username, token) => {
    setLoggedInUser(username);
    setSeriesData(JSON.parse(atob(token.split('.')[1]))['seriesData']);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="container">
      {loggedInUser ? (
        <div>
          <div className="header">
            <h1>Welcome, {loggedInUser}!</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
          <ShowInfo webSeriesData={seriesData} />
          <AddEntityPage addWebSeries={addWebSeries} />
        </div>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;