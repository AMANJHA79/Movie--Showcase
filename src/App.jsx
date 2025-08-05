import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import heroImage from "./assets/hero.png";
import Search from "./components/Search";
import axios from "axios";
import Spinner from "./components/Spinner";
import Error from "./components/Error";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const App = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useDebounce(
    () => {
      setDebouncedSearchTerm(search);
    },
    500,
    [search]
  );

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setError("");
    try {
      const endpoint = query
        ? `${import.meta.env.VITE_API_BASE_URL}/api/search/movie?query=${query}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/discover/movie?sort_by=popularity.desc`;
  
      const response = await axios.get(endpoint);
      if (!response) {
        setError("Error fetching movies! Please try again later.");
        setMoviesList([]);
        return;
      }
      setMoviesList(response.data.results);
      if(query && response.data.results.length > 0) {
        await updateSearchCount(search, response.data.results[0]);
        // Update trending movies immediately after search count update
        await loadTrendingMovies();
      }
      
      
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setError("Error fetching movies! Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);

        
    } catch (error) {
        console.error(error);
        
        
    }
  }
  

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);

  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();

    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadTrendingMovies();
    }, 30000);

    return () => clearInterval(interval);
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

        {
            trendingMovies.length > 0 && 
            <section className="trending">
                <h2>Trending Movies</h2>
                <ul>
                    {trendingMovies.map((movie , index) => (
                        <li key={movie.$id}>
                            <p>
                                {
                                    index +1
                                }
                            </p>
                            <img src={movie.poster_url} alt={movie.title} />

                        </li>
                    ))}
                </ul>

            </section>
        }






        <section className="all-movies">
          <h2 >All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Error error={error} />
          ) : (
            <ul>
              {moviesList.map((movie) => (
               <MovieCard  key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
          
        </section>
      </div>
    </main>
  );
};

export default App;
