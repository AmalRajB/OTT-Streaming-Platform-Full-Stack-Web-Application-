import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './titlecard.css'
import { Link } from 'react-router-dom'

const TitleCard = () => {

    const [data, setData] = useState([]);
    const [watchlistIds, setWatchlistIds] = useState([]);
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const displaydata = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api_movielist",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

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
            fetchWatchlistIds(); // Refresh IDs after adding
        } catch (error) {
            console.log(error);
            alert("Failed to add to watchlist");
        }
    };

    useEffect(() => {
        displaydata();
        fetchWatchlistIds();
    }, []);


    return (
        <>
            <div className="titlecards">
                <h4>Trending Movies</h4>
                <div className="card-list">
                    {data.slice(1, 7).map((card, index) => {
                        return <div className='card' key={index}>
                            <img src={`http://127.0.0.1:8000${card.thumbnail}`} alt="" />
                            <div className="card-options">
                                <Link to={`/movie/${card.id}`} title="Watch">
                                    <button className="watch-btn" title="Watch">
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
                                    style={{ opacity: watchlistIds.includes(card.id) ? 0.5 : 1, cursor: watchlistIds.includes(card.id) ? "not-allowed" : "pointer" }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                        {watchlistIds.includes(card.id) ? (
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /> // Check icon
                                        ) : (
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /> // Plus icon
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    })}
                </div>
            </div>

            <div className="titlecards">
                <h4>Popular Movies</h4>
                <div className="card-list-popular">
                    {data.slice(1, 7).map((card, index) => {
                        return <div className='card' key={index}>
                            <img src={`http://127.0.0.1:8000${card.thumbnail}`} alt="" />
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
                                    style={{ opacity: watchlistIds.includes(card.id) ? 0.5 : 1, cursor: watchlistIds.includes(card.id) ? "not-allowed" : "pointer" }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                        {watchlistIds.includes(card.id) ? (
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /> // Check icon
                                        ) : (
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /> // Plus icon
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    })}
                </div>
            </div>

            <div className="titlecards">
                <h4>Recommended Movies</h4>
                <div className="card-list-recommended ">
                    {data.map((card, index) => {
                        return <div className='card' key={index}>
                            <img src={`http://127.0.0.1:8000${card.thumbnail}`} alt="" />
                            <div className="card-options">
                                <Link to={`/movie/${card.id}`} title="Watch">
                                    <button className="watch-btn" title="Watch">
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
                                    style={{ opacity: watchlistIds.includes(card.id) ? 0.5 : 1, cursor: watchlistIds.includes(card.id) ? "not-allowed" : "pointer" }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                        {watchlistIds.includes(card.id) ? (
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /> // Check icon
                                        ) : (
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /> // Plus icon
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}
export default TitleCard
