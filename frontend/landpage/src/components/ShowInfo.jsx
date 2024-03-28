import React from 'react';
import data from "../data.json";

const ShowInfo = () => {
  return (
    <div>
      <h1>TOP WEB SERIES</h1>
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
