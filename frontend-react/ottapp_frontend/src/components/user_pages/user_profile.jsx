import React, { useEffect, useState } from 'react'
import '../page_styles/user_profile.css'
import Navbar from '../user_navbar_footer/usernavbar'
import Footer from '../user_navbar_footer/userfooter'
import Profileimg from '../images/Profileimg.webp'
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from '../../store/authslice';
import { Link, useNavigate } from "react-router-dom";
import Checkauth from '../auth/checkauth'



const user_profile = () => {

    const [info, setinfo] = useState('')
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        if (user) {

            axios.post(
                "http://127.0.0.1:8000/api_logout",
                {},
                {
                    headers: {
                        Authorization: "Token " + user.token  
                    }
                }
            )
                .then(() => {
                    dispatch(removeUser()); 
                    navigate('/');
                })
                .catch((err) => {
                    console.log("Logout error:", err);
                    dispatch(removeUser());
                    navigate('/');
                });
        }

    }



    const displaydata = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api_user_profile",
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setinfo(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        displaydata();
    }, []);


    return (
        <>
            <Navbar />
            <div className="user_profile_body">
                <div className='profile_data'>
                    <img src={Profileimg} alt="img" />
                    <h5>{info.email}</h5>
                </div>
                <div className="profilebuttons">
                    <span className='profile_update' ><Link to={'/profile_update'}>update</Link></span>
                    <span className='logout' onClick={logout} >Logout</span>
                </div>




            </div>


            <Footer />
        </>
    )
}

export default Checkauth(user_profile);