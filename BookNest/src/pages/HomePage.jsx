// import React, { useState, useEffect, useContext } from 'react'
// import AuthContext from '../context/AuthContext';
import "../styles/HomePage.css";
import intro_hero_top from "../assets/intro-hero-top.png";
import HomeBookLists from '../components/HomeBookLists';
import Footer from '../components/Footer';
import RollingGallery from '../components/RollingGallery';
import RotatingText from "../components/Home_Page_Compos/RotatingText";
import MainNavbar from "../components/MainNavbar";


const HomePage = () => {

  // let { api_link, authTokens, logoutUser } = useContext(AuthContext)

  return (
    <div >
      <MainNavbar />
      <div className='welcome-box'>
        <div style={{display:'flex', flexDirection:'column', alignItems:'start'}}>
          <div className="rotating-text">
            <RotatingText
              texts={['Welcome,', 'Bonjour,', 'नमस्ते,', 'Wëllkomm,', 'வணக்கம்,', 'नमस्कार,']}
              mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>

          <h1>Nishi</h1>
        </div>

        <img src={intro_hero_top} />
      </div>

      {/* <Spin /> */}

      <RollingGallery />

      <div className='section-3'>
        <HomeBookLists />
      </div>

      <Footer />
    </div>
  )
}

export default HomePage
