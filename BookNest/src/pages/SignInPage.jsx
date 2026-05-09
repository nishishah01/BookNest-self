import React, { useContext, useEffect } from "react";
import "../styles/SignInPage.css";
import fancy_book from "../assets/fancy_book_1.png"
import profile from '../assets/profile.svg'
import password from '../assets/key.svg'
import eye from '../assets/eye.svg';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const SignInPage = () => {

  const navigate = useNavigate();
  const { loginUser, user, authTokens } = useContext(AuthContext)

  // Redirect authenticated users to home page
  useEffect(() => {
    if (user && authTokens) {
      navigate('/home');
    }
  }, [user, authTokens, navigate]);

  const handleSignUpPage = () => {
    navigate("/signup");
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="left-section">
          <div className="logo">
            <img src={logo} />
          </div>
          <img 
            src={fancy_book} 
            className="mascot-image"
          />
          <div className="signup-prompt">
            <p>Don't have an account yet?</p>
            <button className="signup-button" onClick={handleSignUpPage}>Sign Up</button>
          </div>
        </div>

        <div className="right-section">
          <div className="welcome-text" style={{marginTop:'5vh'}}>
            <h1>Welcome,</h1>
            <h2>Please Sign in to Your Account</h2>
          </div>

          <form className="signin-form" onSubmit={loginUser}>
            <div className="input-group">
                <img src={profile} style={{ color: "#813C21" }} />
              <input type="text" name="username" placeholder="Username" required autoComplete="username" />
            </div>
            <div className="input-group">
                <img src={password} />
              <input type="password" name="password" placeholder="Password" required autoComplete="current-password" />
              <img src={eye} style={{cursor:'pointer'}}/>
            </div>

            {/* <span className="forgot-password">Forgot password?</span> */}

            <div className="checkbox-group">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">I agree with Terms and conditions and privacy policy</label>
            </div>
            <button type="submit" className="signin-button">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignInPage;