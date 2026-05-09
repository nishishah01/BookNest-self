import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import IntroNavbar_1 from '../components/IntroNavbar_1';
import IntroPage_1 from '../components/Intro_Page_Sections/IntroPage_1';
import IntroPage_2 from '../components/Intro_Page_Sections/IntroPage_2';
import IntroPage_3 from '../components/Intro_Page_Sections/IntroPage_3';
import Footer from '../components/Footer';
import IntroLogo from './IntroLogo';
import IntroPage_0 from '../components/Intro_Page_Sections/IntroPage_0';

const IntroPage = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [hideLogo, setHideLogo] = useState(false);
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is authenticated and redirect to home
  useEffect(() => {
    if (user && authTokens) {
      navigate('/home');
      return;
    }
  }, [user, authTokens, navigate]);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setHideLogo(true);
    }, 3000); 

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="relative">
      {!hideLogo && <IntroLogo fadeOut={fadeOut} />}
      <IntroNavbar_1 />
      <IntroPage_0 />
      <IntroPage_1 />
      <IntroPage_2 />
      <IntroPage_3 />
      <Footer />
    </div>
  );
};

export default IntroPage;
