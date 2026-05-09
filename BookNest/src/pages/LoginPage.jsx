import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import "../styles/Login.css";
import signin_bg from "../assets/signin_bg.png";
import blur_img from "../assets/blur_img.png";
import logo from "../assets/logo.png";
import fancy_book_1 from "../assets/fancy_book_1.png";
import email from "../assets/email.svg";
import eye from "../assets/eye.svg";
import key from "../assets/key.svg";
import google from "../assets/google.png";
import linkedin from "../assets/linkedin.png";
import twitter from "../assets/twitter.png";
import microsoft from "../assets/microsoft.png";

const LoginPage = () => {
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (user && authTokens) {
      navigate('/home');
    }
  }, [user, authTokens, navigate]);

  return (
    <div className='login-page'>
      <div className='first-box'>
        <img src={signin_bg} className='main-bg' />

        <div className='blur-box'>
          <img src={logo} className='logo' />

          <img src={fancy_book_1} className='fancy-book' />

          <h3>Don't have an account yet? </h3>

          <button>Sign Up</button>
        </div>
      </div>
      <div className='second-box'>
        <div className='form-box'>
          <h2>Sign in to your account</h2>

          <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'5vh', marginTop:'10vh', alignItems:'center'}}>
            <div className='input-box'>
              <img src={email} />
              <input type='email' className='email-input' placeholder='Email' />
            </div>
            <div className='input-box'>
              <img src={key} />
              <input type='password' className='pass-input' placeholder='Password' />
              <img src={eye} />
            </div>
          </div>

          <div style={{marginTop:'5vh'}}>
              <input type="checkbox" id="terms" />
              <label for="terms">
                I agree with the terms and conditions and privacy policy.
              </label>
          </div>

          <button className='sign-in-but'>Sign In</button>

          <p style={{color:'white', marginTop:'5vh', fontSize:'1.1vw'}}>or Sign In using</p>
          
          <div style={{width:'90%', display:'flex', alignItems:'center', justifyContent:'center', gap:'2vw', marginTop:'5vh'}}>

              <img src={google} style={{width:'10%'}}/>
              <img src={linkedin} style={{width:'10%'}}/>
              <img src={twitter} style={{width:'10%'}}/>
              <img src={microsoft} style={{width:'10%'}}/>

          </div>

        </div>
      </div>

    </div>
  )
}

export default LoginPage;

{/* <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input type="submit" />
</form> */}
