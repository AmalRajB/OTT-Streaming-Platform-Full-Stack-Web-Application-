import React, { useState, useEffect } from 'react';
import '../page_styles/user_home.css';
import Navbar from '../user_navbar_footer/usernavbar';
import Titlecomponent from './home_sub_comp/titlecard'
import Footer from '../user_navbar_footer/userfooter'
import Checkauth from '../auth/checkauth'
import axios from 'axios';
import { Link } from 'react-router-dom'



function Home() {


  const [currentSlide, setCurrentSlide] = useState(0);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const [bannercards, setbannercards] = useState([])
  const fetchbanner = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api_movielist",
        {
          headers: {
            Authorization: `Token ${token}`,
          }
        }
      );
      console.log("data fetched")
      setbannercards(response.data)

    } catch (error) {
      console.log(error)
    }

  }




  useEffect(() => {
    fetchbanner()
  }, []);

  useEffect(() => {
    if (bannercards.length > 0) {
      const displayCount = Math.min(bannercards.length, 4);
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % displayCount);
      }, 10000);
      return () => clearInterval(slideInterval);
    }
  }, [bannercards]);




  return (
    <>
      <div className="navbarcomponent">
        <Navbar />

      </div>

      <div className="home_body">


        {/* <div className="container"> */}

        <div className="homebanner">
          <div
            className="slider-wrapper"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {bannercards.slice(-4).map((img, index) => (
              <div className="slide" key={index}>
                <img src={`http://127.0.0.1:8000${img.thumbnail}`} alt='banner' className="banner-img" />
                <div className="banneroptions">
                  <Link to={`/movie/${img.id}`} title="Watch">
                    <button className="bannerwatch-btn">
                      watch
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-dots">
            {bannercards.slice(-4).map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
        {/* </div> */}
        <Titlecomponent />

        <div>
          <Footer />
        </div>


      </div>





    </>
  );
}

export default Checkauth(Home);