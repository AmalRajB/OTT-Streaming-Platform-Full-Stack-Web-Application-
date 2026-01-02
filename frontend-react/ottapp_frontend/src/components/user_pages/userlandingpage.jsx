import React, { useState, useEffect } from 'react';
import '../page_styles/landingpage.css';
import Logo from '../images/brandlogo.png';
import { useNavigate } from 'react-router-dom';
useNavigate

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate()

  const featuredContent = [
    {
      title: "Dune: Part Two",
      image: "https://m.media-amazon.com/images/S/pv-target-images/51eb70adfa913d8675335aedb7fe7b5ef3f84b75ac842ae5baffec261fbbf600.jpg",
      genre: "Sci-fi/Adventure"
    },
    {
      title: "Kantara: A Legend",
      image: "https://4kwallpapers.com/images/wallpapers/rishab-shetty-3840x2160-19889.jpg",
      genre: "Action/Fantasy"
    },
    {
      title: "Shutter Island",
      image: "https://www.neuroetpsycho.com/wp-content/uploads/2025/01/Shutter-island.webp",
      genre: "Thriller/Mystery"
    }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredContent.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    navigate('/login')
    // console.log('Navigate to Login page');
    // Add your navigation logic here
    // For example: navigate('/login') or window.location.href = '/login'
  };

  const handleSignupClick = () => {

    navigate('/signup')
    // console.log('Navigate to Signup page');
    // Add your navigation logic here
    // For example: navigate('/signup') or window.location.href = '/signup'
  };

  return (
    <div className="landing-container">
      <div className="bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className={`content-grid ${mounted ? 'mounted' : ''}`}>
        
        <div className="hero-section">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="logo-icon-shimmer"></div>
              <span className="play-icon">▶</span>
            </div>
            <img src={Logo} alt="Logo" className="landing-logo" />
          </div>

          <div className="hero-content">
            <h2 className="hero-title">
              Unlimited Entertainment
              <span className="title-accent">Starts Here</span>
            </h2>
            <p className="hero-description">
              Stream thousands of movies and TV shows. Watch anywhere, anytime.
            </p>

            <div className="featured-carousel">
              {featuredContent.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === activeSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="carousel-overlay">
                    <span className="genre-tag">{item.genre}</span>
                    <h3 className="content-title">{item.title}</h3>
                  </div>
                </div>
              ))}
              
              <div className="carousel-indicators">
                {featuredContent.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Movies</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">TV Shows</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">4K</div>
              <div className="stat-label">Quality</div>
            </div>
          </div>
        </div>

        <div className="auth-section">
          <div className="cta-card">
            <div className="cta-content">
              <div className="cta-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              
              <h2 className="cta-title">Ready to Watch?</h2>
              <p className="cta-description">
                Join millions of users streaming their favorite content. Create your account or sign in to continue.
              </p>

              <div className="button-group">
                <button className="primary-btn" onClick={handleSignupClick}>
                  <span>Get Started</span>
                  <span className="btn-arrow">→</span>
                </button>
                
                <button className="secondary-btn" onClick={handleLoginClick}>
                  <span>Login</span>
                </button>
              </div>

              <div className="features">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span className="feature-text">No payment required</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span className="feature-text">Enjoy your favorite movies for free</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span className="feature-text">Watch on any device</span>
                </div>
              </div>

              <div className="divider">
                <div className="divider-line"></div>
                <span className="divider-text">Popular on MOVIEFLIX</span>
                <div className="divider-line"></div>
              </div>

              <div className="thumbnail-grid">
                <div className="thumbnail" style={{backgroundImage: 'url(https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/16221040/parabellumcover.jpg?quality=90&strip=all&crop=7.8362408553742,0,84.327518289252,100)'}}>
                  <div className="thumbnail-overlay">Action</div>
                </div>
                <div className="thumbnail" style={{backgroundImage: 'url(https://m.media-amazon.com/images/M/MV5BMzBkZmQ0NjMtNTZlMy00ZjdlLTg5ODUtYWFlNGM0YzE3MTg0XkEyXkFqcGc@._V1_.jpg)'}}>
                  <div className="thumbnail-overlay">Drama</div>
                </div>
                <div className="thumbnail" style={{backgroundImage: 'url(https://getwallpapers.com/wallpaper/full/b/d/1/20169.jpg)'}}>
                  <div className="thumbnail-overlay">Sci-Fi</div>
                </div>
                <div className="thumbnail" style={{backgroundImage: 'url(https://stat4.bollywoodhungama.in/wp-content/uploads/2021/01/Dunki-2-306x393.jpg)'}}>
                  <div className="thumbnail-overlay">Comedy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;