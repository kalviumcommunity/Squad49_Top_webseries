// App.jsx

import React, { useState, useEffect } from 'react';
import ShowInfo from './components/ShowInfo';
import AddEntityPage from './components/AddEntityPage';
import LoginPage from './components/LoginPage';
import webSeriesData from './data.json'; 

import './App.css'; 

const App = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    setSeriesData(webSeriesData); 
  }, []);

  const addWebSeries = (newSeries) => {
    setSeriesData([...seriesData, newSeries]);
  };

  const handleLogin = (username) => {
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
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
