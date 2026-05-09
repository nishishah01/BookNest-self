import React from 'react';
import "../../styles/Intro-hero.css";
import intro_books from "../../assets/intro-books.png";
import intro_hero_top from "../../assets/intro-hero-top.png";
import arrow from "../../assets/rightArrow.svg";
import { useNavigate } from 'react-router-dom';

const IntroPage_1 = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/home');
  };

  return (
    <div className='bg-box'>
        <div className='top'>
          <img src={intro_hero_top} className='top-decoration' />
        </div>
        <div className='hero'>
          <div className='hero-left'>
            <h1 className='hero-title'>
              Find All Your <br /> 
              <span className='highlight'>Favourite Books</span> <br /> 
              All in one <br /> 
              <span className='highlight'>place!</span>
            </h1>
            <p className='hero-subtitle'>
              Discover, rent, and buy books from our vast collection. 
              Your next great read is just a click away.
            </p>
            <button className='explore-btn' onClick={handleExploreClick}>
              <span>Explore Now</span>
              <img src={arrow} alt="arrow" className='arrow-icon' />
            </button>
          </div>
          <div className='hero-right'>
            <div className='book-container'>
              <img src={intro_books} className='hero-books' />
              <div className='floating-elements'>
                <div className='floating-dot dot-1'></div>
                <div className='floating-dot dot-2'></div>
                <div className='floating-dot dot-3'></div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  )
}

export default IntroPage_1;
