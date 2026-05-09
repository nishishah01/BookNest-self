import React, { useState, useContext, useEffect } from "react";
import "../styles/SignUpPage.css"; 
import fancy_book from "../assets/fancy_book_1.png";
import email from "../assets/email.svg";
import password from "../assets/key.svg";
import eye from "../assets/eye.svg";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (user && authTokens) {
      navigate('/home');
    }
  }, [user, authTokens, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignInPage = () => {
    navigate("/login");
  }

  return (
    <div className="signup-container">
      <div className="signup-card">

       
        <div className="right-section">
          <div className="welcome-text" style={{marginBottom:'0px'}}>
            <h1>Create Account,</h1>
            <h2>Sign up to get started</h2>
          </div>

          <form className="signup-form">
            <div className="input-group">
              <img src="" alt="User icon" />
              <input type="text" placeholder="Full Name" required />
            </div>
            
            <div className="input-group">
              <img src={email} alt="Email icon" />
              <input type="email" placeholder="Email" required />
            </div>
            
            <div className="input-group">
              <img src={password} alt="Password icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
              />
              <img 
                src={eye} 
                alt="Show password" 
                style={{ cursor: "pointer" }}
                onClick={togglePasswordVisibility}
              />
            </div>
            
            <div className="input-group">
              <img src={password} alt="Confirm password icon" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                required 
              />
              <img 
                src={eye} 
                alt="Show password" 
                style={{ cursor: "pointer" }}
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree with Terms and conditions and privacy policy</label>
            </div>
            
            <button type="submit" className="signup-button-main">Sign Up</button>
          </form>
        </div>
        <div className="left-section">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <img src={fancy_book} className="mascot-image" alt="Book" />
          <div className="signin-prompt">
            <p>Already have an account?</p>
            <button className="signin-button-alt" onClick={handleSignInPage}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}