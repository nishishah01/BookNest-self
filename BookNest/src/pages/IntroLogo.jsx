import React from 'react';
import logo from "../assets/logo.png";

const IntroLogo = ({ fadeOut }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'absolute',
        zIndex: 200,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      <img src={logo} />
    </div>
  );
};

export default IntroLogo;
