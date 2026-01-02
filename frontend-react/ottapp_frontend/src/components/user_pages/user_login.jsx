import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authslice";
import '../page_styles/user_login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


function Login() {

    const [user, setuser] = useState({
        email: "",
        password: ""
    }
    )
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlesubmit = (e) => {
        e.preventDefault()
        axios.post("http://127.0.0.1:8000/api_login",user).then(response => {
            setErrorMessage('')
            var info = {
                email:user.email,
                token:response.data.token
            };
            dispatch(setUser(info))
            navigate('/home')
        }).catch(error => {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (typeof data === 'object') {
                    let errors = [];

                    for (let key in data) {
                        if (Array.isArray(data[key])) {
                            errors.push(...data[key]);
                        } else {
                            errors.push(data[key])
                        }
                    }
                    setErrorMessage(errors.join(" "));
                    return;
                }
                setErrorMessage("unexpected server error.")
            } else {
                setErrorMessage('failed to connect to API')
            }
        })


    }


    return (
        <>
            <div className='login_body'>
                <div className="container">
                    <div className="login_card">
                        <h3 className="login_title">Login</h3>

                        <form onSubmit={handlesubmit}>
                            <div className="login_form-group">
                                <label>Email</label>
                                <input type="email" onChange={(e) => setuser({ ...user, email: e.target.value })} placeholder="Enter your email" required />
                            </div>

                            <div className="login_form-group">
                                <label>Password</label>
                                <input type="password" onChange={(e) => setuser({ ...user, password: e.target.value })} placeholder="Enter your password" required />
                            </div>

                            <button type="submit">Login</button>
                        </form>
                        <span className="signuplink">New to this App ? <Link to={'/signup'} >Signup </Link> </span> <br />

                    </div>
                    <span className='login_error_message'>{errorMessage}</span>


                </div>
            </div>

        </>
    )
}

export default Login
