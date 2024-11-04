import axios from "axios";
import "./Register.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Register() {
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
    if(userInput.password !== userInput.confpassword){
        setLoading(true)
        return toast.error("Password Doesn't match")
    }
   try{
    const register = await axios.post(`/api/auth/register`,userInput);
    const data = register.data;
    if(data.success === false){
        setLoading(false)
        toast.error(data.message)
        console.log(data.message);
    }
    toast.success(data.message);
    localStorage.setItem('chathub',JSON.stringify(data))
    setAuthUser(data);
    setLoading(false)
    navigate('/');
   } catch(error){
    setLoading(false);
    console.log(error);
    toast.error(error?.response?.data?.message)
   }
  };

      return(
        <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Register</h2>
  
          <input
            type="text"
            placeholder="Full Name"
            id="fullname"
            onChange={handleInput}
            className="login-input"
            required
          />
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleInput}
            className="login-input"
            required
          />
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

        <input
          type="text"
          placeholder="Confirm Password"
          id="confpassword"
          onChange={handleInput}
          className="login-input"
          required
        />  

        <div id="gender" className="gender-input">
            <label>Gender:</label>
            <input type="radio" id="gender" name="gender" value="male" onChange={handleInput}></input>
            <label htmlFor="male">Male</label>
            <input type="radio" id="gender" name="gender" value="female" onChange={handleInput}></input>
            <label htmlFor="female">Female</label>
        </div>
  
          <button type="submit" className="login-button">
              {loading ? "loading..":"Register"}
          </button>
          <div className="part-2">
              <p><Link to={'/login'}>Login Now!!</Link></p>
          </div>
        </form>
      </div>
    )
}