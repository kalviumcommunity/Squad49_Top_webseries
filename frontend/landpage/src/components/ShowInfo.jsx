import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowInfo = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/webseries_data')
      .then(response => response.data)
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Shows Information</h1>
      {data.map(show => (
        <div key={show._id}>
          <h2>{show.title}</h2>
          <p>Genre: {show.genre}</p>
          <p>Platform: {show.platform}</p>
          <p>Release Date: {show.release_date}</p>
          <p>Description: {show.description}</p>
          <p>Average Rating: {show.average_rating}</p>
          <p>Number of Seasons: {show.number_of_seasons}</p>
          <p>Total Episodes: {show.total_episodes}</p>
        </div>
      ))}
    </div>
  );
}

export default ShowInfo;
