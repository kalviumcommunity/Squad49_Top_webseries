import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Top Series</a>
          <a href="#">Categories</a>
          <a href="#">Sign Up / Log In</a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>Discover the Best Web Series Online</h1>
          <button>Explore Now</button>
        </section>
        <section className="featured">
          <h2>Featured Series</h2>
        </section>
        <section className="categories">
          <h2>Categories</h2>
        </section>
        <section className="trending">
          <h2>Trending Now</h2>
        </section>
        <section className="about">
          <h2>About Us</h2>
        </section>
      </main>
    </div>
  );
}

export default App;
