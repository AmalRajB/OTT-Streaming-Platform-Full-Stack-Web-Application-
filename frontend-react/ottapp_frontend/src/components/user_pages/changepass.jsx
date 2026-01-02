import React, { useState } from 'react'
import '../page_styles/changepass.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Checkauth from '../auth/checkauth'


const changepass = () => {


  const [password, setpassword] = useState({
    old_password: "",
    new_password: ""
  })
  const [errorMessage, setErrorMessage] = useState('')
  const navigator = useNavigate()
  const token = JSON.parse(localStorage.getItem("user"))?.token;


  const handlesubmit = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api_user_pass_change', password,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    ).then(response => {
      setErrorMessage('')
      navigator('/home')
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

      <div className="changepass_body">
        <div className="container">
          <form onSubmit={handlesubmit} className='changepass_form' action="">
            <input className='changepass_input' type="text" onChange={(e)=>setpassword({...password,old_password:e.target.value})} placeholder='enter the old password' required /> <br /> <br />
            <input className='changepass_input' type="text" onChange={(e)=>setpassword({...password,new_password:e.target.value})} placeholder='enter the new password' required /> <br />
            <button className='changepass_btn btn btn-sm btn-primary' type='submit'>submit</button>
            <span className='changepass_cancel btn btn-sm btn-danger'><Link to={'/profile'}>cancel</Link></span>
          </form>
          <p className='changepass_error'>{errorMessage}</p>
        </div>
      </div>

    </>
  )
}

export default Checkauth(changepass)