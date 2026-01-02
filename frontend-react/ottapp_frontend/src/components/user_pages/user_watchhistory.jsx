import React, { useEffect, useState } from 'react'
import '../page_styles/user_watchhistory.css'
import Navbar from '../user_navbar_footer/usernavbar'
import Footer from '../user_navbar_footer/userfooter'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Checkauth from '../auth/checkauth'


const UserWatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api_watch_history", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setWatchHistory(response.data);
      } catch (error) {
        console.error("Error fetching watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      let date;

      // Handle different date formats from API
      if (typeof dateString === 'number') {
        date = new Date(dateString);
      } else if (typeof dateString === 'string') {
        // Convert "YYYY-MM-DD HH:MM:SS" to ISO format
        const isoString = dateString.replace(' ', 'T');
        date = new Date(isoString);
      } else {
        date = new Date(dateString);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }

      // Format to show month, date, and time
      return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <Navbar />
      <div className="watchhistory_body">
        <div className="container">
          <h1 className="watchhistory_title">Watch History</h1>

          {loading ? (
            <p className="loading_text">Loading watch history...</p>
          ) : watchHistory.length === 0 ? (
            <div className="empty_state">
              <svg viewBox="0 0 24 24" fill="currentColor" className="empty_icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <h2>No Watch History Yet</h2>
              <p>Start watching movies to build your history</p>
            </div>
          ) : (
            <div className="watchhistory_grid">
              {watchHistory.map((item, index) => {
                const movieData = item.movie || item;
                const movieId = movieData.id;
                const thumbnail = movieData.thumbnail;
                const title = movieData.title || 'Untitled';
                const watchedAt = item.watched_at || item.created_at;

                return (
                  <Link to={`/movie/${movieId}`} key={index} className="watch_history_card">
                    <div className="card_image_wrapper">
                      <img
                        src={`http://127.0.0.1:8000${thumbnail}`}
                        alt={title}
                        className="card_image"
                      />
                      <div className="play_overlay">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="play_icon">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="card_info">
                      <h3 className="movie_title">{title}</h3>
                      <p className="watch_date">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="clock_icon">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        {formatDate(watchedAt)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkauth(UserWatchHistory);
