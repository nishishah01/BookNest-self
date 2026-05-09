import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/IntroPage_3.css";
import page_3 from "../../assets/intro-page-3-img.png";

const IntroPage_3 = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const features = [
    {
      icon: "📚",
      text: "Vast Digital Library"
    },
    {
      icon: "🎯",
      text: "Personalized Recommendations"
    },
    {
      icon: "👥",
      text: "Reader Community"
    },
    {
      icon: "💡",
      text: "Smart Reading Analytics"
    }
  ];

  return (
    <div className="intro-page-3">
      <div className="intro-page-3-container">
        {/* Left Content Section */}
        <div className="intro-page-3-content">
          <h1 className="intro-page-3-title">
            Why BookNest?
          </h1>
          
          <p className="intro-page-3-subtitle">
            Your Ultimate Reading Companion
          </p>
          
          <p className="intro-page-3-description">
            BookNest transforms your reading journey with intelligent recommendations, 
            a vibrant community of book lovers, and powerful tools to track your progress. 
            Discover your next favorite book, connect with fellow readers, and build the 
            perfect digital library tailored just for you.
          </p>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Call to Action */}
        
        </div>

        {/* Right Image Section */}
        <div className="intro-page-3-image-container">
          <img 
            src={page_3} 
            alt="BookNest Reading Experience" 
            className="intro-page-3-image"
          />
        </div>
      </div>
    </div>
  );
};

export default IntroPage_3;
