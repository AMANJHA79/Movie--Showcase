import React, { useEffect, useState } from "react";
import heroImage from "./assets/hero.png";
import Search from "./components/Search";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error fetching movies: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setError("Error fetching movies! Please try again later.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src={heroImage} alt="hero" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search search={search} setSearch={setSearch} />
        </header>
        <section className="all-movies">
          <h2>All Movies</h2>
          {error && <p className="text-red-500">{error}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;
