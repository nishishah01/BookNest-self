import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Footer.css";
import logo from "../assets/logo.png";
import SocialHandle from './SocialHandle';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="main-container1">
      <div className="links">
        <div className="grp1">
          <ul>
            <li className="heading">Discover</li>
            <li onClick={() => handleNavigation('/discover')}>Browse Books</li>
            <li onClick={() => handleNavigation('/genres')}>Genres</li>
            <li onClick={() => handleNavigation('/authors')}>Authors</li>
            <li onClick={() => handleNavigation('/bestsellers')}>Bestsellers</li>
            <li onClick={() => handleNavigation('/new-releases')}>New Releases</li>
            <li onClick={() => handleNavigation('/recommendations')}>Recommendations</li>
          </ul>
        </div>
        
        <div className="grp1">
          <ul>
            <li className="heading">Services</li>
            <li onClick={() => handleNavigation('/rent')}>Rent Books</li>
            <li onClick={() => handleNavigation('/buy')}>Buy Books</li>
            <li onClick={() => handleNavigation('/digital-library')}>Digital Library</li>
            <li onClick={() => handleNavigation('/reading-lists')}>Reading Lists</li>
            <li onClick={() => handleNavigation('/book-clubs')}>Book Clubs</li>
          </ul>
        </div>
        
        <div className="grp1">
          <ul>
            <li className="heading">Community</li>
            <li onClick={() => handleNavigation('/reviews')}>Book Reviews</li>
            <li onClick={() => handleNavigation('/discussions')}>Discussions</li>
            <li onClick={() => handleNavigation('/fanart')}>Fan Art</li>
            <li onClick={() => handleNavigation('/author-events')}>Author Events</li>
            <li onClick={() => handleNavigation('/reading-challenges')}>Reading Challenges</li>
          </ul>
        </div>
        
        <div className="grp1">
          <ul>
            <li className="heading">Support</li>
            <li onClick={() => handleNavigation('/help')}>Help Center</li>
            <li onClick={() => handleNavigation('/faq')}>FAQ</li>
            <li onClick={() => handleNavigation('/contact')}>Contact Us</li>
            <li onClick={() => handleNavigation('/about')}>About BookNest</li>
            <li onClick={() => handleNavigation('/careers')}>Careers</li>
          </ul>
        </div>
      </div>

      <div className="border"></div>
      <div className="bottom-part">
        <div className="bottom-logo">
          <img src={logo} alt="BookNest Logo" onClick={() => handleNavigation('/')} />
        </div>
        <div className="list">
          <ul>
            <li onClick={() => handleNavigation('/terms')}>Terms of Service</li>
            <li onClick={() => handleNavigation('/privacy')}>Privacy Policy</li>
            <li onClick={() => handleNavigation('/cookies')}>Cookie Policy</li>
            <li onClick={() => handleNavigation('/accessibility')}>Accessibility</li>
          </ul>
        </div>
        <div className="socials-head">
          <SocialHandle />
        </div>
      </div>
    </div>
  );
};

export default Footer;