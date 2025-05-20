import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login= () => {
  
  const[username, setUsername]=useState('')
  const[password,setPassword]=useState('')
  const[error,setError]=useState('')

  const navigate=useNavigate()
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if (!username.trim()) {
    toast.error('Username is empty!');
    return;
    }
    try{
       const res= await axios.post('http://localhost:5000/login',{username,password})
       localStorage.setItem('token',res.data.token)
       localStorage.setItem('username', username)
       navigate('/dashboard')
       
    }catch(error){
        //  console.error("Login Failed",error)
        //  setError('Invalid Username or Password')
        const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : (error.response && typeof error.response.data === 'string'
            ? error.response.data
            : 'Invalid Username or Password');
      toast.error(errorMsg);
    }
  }
  return (
    <div className='register-container'>
      <h1>Login</h1>
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
          <button type='submit' className="submit-button">Login</button>
      </form>
       {/* <p>Already have an account?<Link to="/login">SignUp Here</Link></p> */}
       <ToastContainer />
    </div>
  )
}

export default Login
