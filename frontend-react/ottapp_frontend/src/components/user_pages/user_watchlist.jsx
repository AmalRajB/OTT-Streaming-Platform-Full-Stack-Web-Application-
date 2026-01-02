import React, { useEffect, useState } from 'react'
import '../page_styles/userwatchlist.css'
import Navbar from '../user_navbar_footer/usernavbar'
import Footer from '../user_navbar_footer/userfooter'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './home_sub_comp/titlecard.css' // Reuse card styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Checkauth from '../auth/checkauth'


const UserWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"))?.token;



  const deletemovie = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api_delete_watchlist/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Update the UI by removing the deleted movie from the watchlist
      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((item) => {
          const itemId = item.movie?.id || item.id;
          return itemId !== id;
        })
      );

      console.log("Movie removed from watchlist successfully");
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      alert("Failed to remove movie from watchlist. Please try again.");
    }
  };



  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api_user_watchlist", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="watchlistbody">
        {watchlist.length === 0 ? (
          <h1>watchlist is empty</h1>
        ) : (
          <div className="titlecards">
            <h4 className='mywatchlisth4'>My Watchlist</h4>
            <div className="card-list-popular" style={{ flexWrap: 'wrap' }}> {/* Reusing class but might need wrap for a full page list */}
              {watchlist.map((card, index) => {
                return (
                  <div className='card' key={index}>
                    <img src={`http://127.0.0.1:8000${card.movie?.thumbnail || card.thumbnail}`} alt="" />
                    {/* Handling potential nested movie object if serialization differs, fallback to card.thumbnail */}
                    <div className="card-options">
                      <Link to={`/movie/${card.movie?.id || card.id}`} title="Watch">
                        <button className="watch-btn">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </Link>
                      {/* Remove button could be added here later */}
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="remove-icon"
                        onClick={() => deletemovie(card.movie?.id || card.id)}
                      />

                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
export default Checkauth(UserWatchlist);
