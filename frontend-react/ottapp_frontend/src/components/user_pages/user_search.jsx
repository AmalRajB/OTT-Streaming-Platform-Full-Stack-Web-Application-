import React, { useState,useEffect  } from 'react'
import { Link } from 'react-router-dom'
import '../page_styles/user_search.css'
import './home_sub_comp/titlecard.css'
import Navbar from '../user_navbar_footer/usernavbar'
import Footer from '../user_navbar_footer/userfooter'
import axios from 'axios'
import Checkauth from '../auth/checkauth'


const user_search = () => {
  const [key, setkey] = useState('')
  const [result, setresult] = useState([])
  const [errorMessage, seterrorMessage] = useState('')

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const [watchlistIds, setWatchlistIds] = useState([]);

  const fetchWatchlistIds = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api_user_watchlist",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const ids = response.data.map(item => item.movie?.id || item.id);
      setWatchlistIds(ids);
    } catch (error) {
      console.log("Error fetching watchlist IDs:", error);
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api_addwatchlist/add/",
        { movie_id: movieId },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert("Added to watchlist");
      fetchWatchlistIds();
    } catch (error) {
      console.log(error);
      alert("Failed to add to watchlist");
    }
  };

  const searchresult = async (e) => {
    e.preventDefault();
    seterrorMessage('');

    if (!key.trim()) {
      seterrorMessage('Please enter a search term');
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api_movie_search/?title=${key}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setresult(response.data);
      if (response.data.length === 0) {
        seterrorMessage('No movies found matching your search');
      }
    } catch (error) {
      console.log(error);
      seterrorMessage('No movies found matching your search');
    }
  };

  React.useEffect(() => {
    fetchWatchlistIds();
  }, []);










  return (
    <>
      <Navbar />

      <div className="searchbody">
        <div className="search-container">
          <form onSubmit={searchresult} className='searchform'>
            <input type='text' value={key} onChange={(e) => setkey(e.target.value)} placeholder='Search Movies' />
            <button className='search_btn' type='submit'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z" fill="currentColor" /></svg>
            </button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="search_result">
            {result.length > 0 && (
              <div className='titlecards'>
                <div className='card-list-popularr' style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  {result.map((card, index) => (
                    <div className='card' key={index}>
                      <img src={`http://127.0.0.1:8000${card.thumbnail}`} alt={card.title} />
                      <div className="card-options">
                        <Link to={`/movie/${card.id}`} title="Watch">
                          <button className="watch-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </Link>
                        <button
                          className="add-btn"
                          title={watchlistIds.includes(card.id) ? "Already in List" : "Add to List"}
                          onClick={() => addToWatchlist(card.id)}
                          disabled={watchlistIds.includes(card.id)}
                          style={{
                            opacity: watchlistIds.includes(card.id) ? 0.5 : 1,
                            cursor: watchlistIds.includes(card.id) ? "not-allowed" : "pointer"
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                            {watchlistIds.includes(card.id) ? (
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            ) : (
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkauth(user_search);