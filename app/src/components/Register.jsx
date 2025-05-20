import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  
  const[username, setUsername]=useState('')
  const[password,setPassword]=useState('')
  const navigate=useNavigate()
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
    toast.error('Username and password are required!');
    return;
    }
    try{
       await axios.post('https://skillcheckr.onrender.com/register',{username,password})
        toast.success('Registered successfully!');
       setUsername('')
       setPassword('')
      setTimeout(() => navigate('/login'),1500);
      }catch(error){
         toast.error('username already registered!');
    }
  }
  return (
    <div className='register-container'>

      <h1>Register</h1>
      <form onSubmit={handleSubmit} className='register-form'>
          <input type="text"
            placeholder='username'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className='input-field'>

          </input>
          <input type="password"
            placeholder='Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className='input-field'>
          </input>
          <button type='submit' className="submit-button">Register</button>
      </form> 
       <p>Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login Here</Link></p>
       <ToastContainer />
    </div>
  )
}

export default Register
