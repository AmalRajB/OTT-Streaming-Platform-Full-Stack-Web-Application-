import axios from 'axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'
import '../page_styles/user_signup.css'




function Signup() {


     const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [confpassword,setconfpassword] = useState('')

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handlesubmit=(e)=>{
        e.preventDefault();
        console.log(confpassword,user.password)
        if(confpassword !== user.password){
            setErrorMessage("wrong confirm password")
            return
        }

        axios.post("http://127.0.0.1:8000/api_signup",user).then(response =>{
            setErrorMessage('')
            navigate('/login')
        }).catch(error =>{
            if(error.response && error.response.data){
                const data = error.response.data;
                if(typeof data ==='object'){
                    let errors = [];

                    for (let key in data){
                        if(Array.isArray(data[key])){
                            errors.push(...data[key]);
                        }else{
                            errors.push(data[key])
                        }
                    }
                    setErrorMessage(errors.join(" "));
                    return;
                }
                setErrorMessage("unexpected server error.")
            }else{
                setErrorMessage('failed to connect to API')
            }
        })

    }



    return (
        <>
            <div className="signup_body">
                <div class="container">
                    <div class="signup_card">
                        <h3 class="signup_title">SignUp</h3>

                        <form onSubmit={handlesubmit}>
                            <div className="signup_form-group">
                                <label>Name</label>
                                <input type="text" onChange={(e)=>setUser({...user,name:e.target.value})} placeholder="Enter your name" required />
                            </div>


                            <div className="signup_form-group">
                                <label>Email</label>
                                <input type="email" onChange={(e)=>setUser({...user,email:e.target.value})} placeholder="Enter your email" required />
                            </div>

                            <div className="signup_form-group">
                                <label>Password</label>
                                <input type="password" onChange={(e)=>setUser({...user,password:e.target.value})} placeholder="Enter your password" required />
                            </div>
                            <div className="signup_form-group">
                                {/* <label>Confirm Password</label> */}
                                <input type="password" onChange={(e)=>setconfpassword(e.target.value)} placeholder="Confirm your password" required />
                            </div>

                            <button type="submit">Signup</button>
                        </form>
                        <span className="loginlink">Already have an account ?<Link to={'/login'} >Login </Link>  </span> <br />
                        <span className='signup_error_message'>{errorMessage}</span>

                    </div>

                </div>
            </div>


        </>
    )
}

export default Signup
