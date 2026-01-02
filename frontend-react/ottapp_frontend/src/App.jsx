import { Routes, Route } from 'react-router'
import './App.css'
import Watchlist from './components/user_pages/user_watchlist'
import Home from './components/user_pages/user_home'
import Watchhistory from './components/user_pages/user_watchhistory'
import Searchpage from './components/user_pages/user_search'
import Profile from './components/user_pages/user_profile'
import Videoplayer from './components/user_pages/movieplayer'
import Changepass from './components/user_pages/changepass'
import PagenotFount from './components/user_pages/pagenotfount'
import LoginProtected from './components/auth/LoginProtected'
import SignUpProtected from './components/auth/SignupProtected'
import LandingProtected from './components/auth/Landingprotected'
function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/signup' element={<SignUpProtected />} />
          <Route path='/login' element={<LoginProtected />} />
          <Route path='/home' element={<Home />} />
          <Route path='/watchlist' element={<Watchlist />} />
          <Route path='/watch_history' element={<Watchhistory/>}/>
          <Route path='/search' element={<Searchpage/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/movie/:id" element={<Videoplayer />} />
          <Route path='/profile_update' element={<Changepass/>} />
          <Route path='/' element={<LandingProtected/>}/>
          <Route path="*" element={<PagenotFount />} />
        </Routes>
      </div>

    </>
  )
}

export default App
