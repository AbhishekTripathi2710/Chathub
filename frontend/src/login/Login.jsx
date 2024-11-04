import React, { useState } from "react";
import "./Login.css";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";


export default function Login() {
    const navigate = useNavigate();
    const {setAuthUser} = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) =>{
    setUserInput({
        ...userInput,[e.target.id]:e.target.value
    })
  }
 
  

  const handleSubmit =async  (e) => {
    e.preventDefault();
    setLoading(true)
   try{
    const login = await axios.post(`/api/auth/login`,userInput)
    const data = login.data;
    if(data.success === false){
        setLoading(false)
        console.log(data.message);
    }
    toast.success(data.message);
    localStorage.setItem('chathub',JSON.stringify(data))
    setAuthUser(data);
    setLoading(false);
    navigate('/');
   } catch(error){
    setLoading(false);
    console.log(error);
    toast.error(error?.response?.data?.message)
   }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleInput}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleInput}
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
            {loading ? "loading..":"Login"}
        </button>
        <div className="part-2">
            <p>Don't have an Account?<Link to={'/register'}>Register Now!!</Link></p>
        </div>
      </form>
    </div>
  );
}
