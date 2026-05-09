import React from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import "../styles/navbar_1.css"

const IntroNavbar_1 = () => {

    const navigate = useNavigate();

  return (
      <div className='navbar-1 overflow-x-hidden fixed'>
        <img style={{width:'172px', height:'69px'}} src={logo} />
        <div style={{display:'flex', gap:'50px'}}>
            <button className='category-but' onClick={() => navigate('/signup')}>
                Sign Up
            </button>
            <button className='category-but' onClick={() => navigate('/login')}>
                Sign In
            </button>
        </div>
      </div>
  )
}

export default IntroNavbar_1;
