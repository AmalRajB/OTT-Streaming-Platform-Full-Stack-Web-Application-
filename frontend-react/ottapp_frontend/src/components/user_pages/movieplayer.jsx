import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../user_navbar_footer/usernavbar";
import "../page_styles/movieplayer.css";
import Checkauth from '../auth/checkauth'


function VideoPlayer() {
    const { id } = useParams(); // movie id from URL
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api_single_moviedata/${id}/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );
                setMovie(response.data);
            } catch (error) {
                console.error("Error fetching movie", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const addToWatchHistory = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/api_add_watchhistory",
                { movie_id: id },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Added to watch history");
        } catch (error) {
            console.error("Error adding to watch history:", error);
        }
    };



    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Play failed:", error);
            });
            setIsPlaying(true);
            addToWatchHistory();
        }
    };

    if (loading) return <p style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Loading video...</p>;
    if (!movie) return <p style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Movie not found</p>;

    const movieData = Array.isArray(movie) ? movie[0] : movie;
    let videoUrl = "";
    if (movieData.movie_file) {
        if (movieData.movie_file.startsWith('http')) {
            videoUrl = movieData.movie_file;
        } else {
            let cleanPath = movieData.movie_file.replace(/\\/g, '/');
            // Remove drive letters like "D:/" if present at the start
            if (/^[a-zA-Z]:\//.test(cleanPath)) {
                cleanPath = cleanPath.split('/').slice(1).join('/');
                const mediaIndex = cleanPath.indexOf('media/');
                if (mediaIndex !== -1) {
                    cleanPath = cleanPath.substring(mediaIndex);
                }
            }
            const hasSlash = cleanPath.startsWith('/');
            videoUrl = `http://127.0.0.1:8000${hasSlash ? '' : '/'}${cleanPath}`;
        }
    }

    return (
        <div className="movie-player-page">
            <Navbar />

            <div className="player-hero">
                <div className="video-wrapper">
                    <video
                        key={videoUrl}
                        ref={videoRef}
                        className="videoplayer"
                        src={videoUrl}
                        controls
                        onPlay={() => {
                            setIsPlaying(true);
                            addToWatchHistory();
                        }}
                        onPause={() => setIsPlaying(false)}
                        onError={(e) => console.error("Video Error:", e.target.error, "Src:", videoUrl)}
                    />
                    {!isPlaying && (
                        <div className="play-button-overlay" onClick={handlePlayClick}>
                            <svg viewBox="0 0 24 24" fill="currentColor" className="play-icon">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <div className="movie-details-container">
                <h1 className="movie-title">{movieData.title}</h1>
                <div className="movie-meta">
                    <span className="match-score">98% Match</span>
                    {/* <span className="year">2024</span> */}
                    <span className="age-rating">U/A 13+</span>
                    {/* <span className="duration">2h 14m</span> */}
                    <span className="quality">HD</span>
                </div>
                <p className="movie-description">
                    {movieData.discription || "Experience this cinematic masterpiece in high definition. A gripping tale that awaits your discovery."}
                </p>
            </div>
        </div>
    );
}

export default Checkauth(VideoPlayer);