import React, { useState } from 'react';
import '../styles/BookReviews.css';

const RentBookReviews = () => {
  const [selectedTab, setSelectedTab] = useState('latest');

  // Sample review data
  const reviews = [
    {
      id: 1,
      name: 'Sushmita',
      category: 'SF',
      distance: '2 miles away',
      text: 'Supporting text lorem ipsum dolor sit amet, consectetur.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Prakriti',
      category: 'SF',
      distance: '2 miles away',
      text: 'Supporting text lorem ipsum dolor sit amet, consectetur.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Arjun',
      category: 'SF',
      distance: '2 miles away',
      text: 'Supporting text lorem ipsum dolor sit amet, consectetur.',
      rating: 5,
    },
  ];

  // Rating distribution data
  const ratingDistribution = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 60 },
    { stars: 3, percentage: 30 },
    { stars: 2, percentage: 15 },
    { stars: 1, percentage: 5 },
  ];

  return (
    <div className="book-reviews-container" style={{marginTop:'0px'}}>
      <h2 style={{ fontFamily: 'Raleway', textAlign: 'left', fontWeight: '500', fontSize:'30px' }}>Rating & Reviews</h2>

      <div className="rating-section">
      <div className="avatar-placeholder">
        <div className="star-icon">★</div>
      </div>
        <div className="rating-prompt">
          <p>What do you think about this Book?</p>

          <button className="review-button">Write a Review</button>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-avatar">
              <div className="avatar-initials">{review.name.charAt(0)}</div>
            </div>

            <div className="review-content">
              <div className="review-header">
                <div>
                  <div className="reviewer-name">{review.name}</div>

                  <div className="review-text">{review.text}</div>
                </div>

                <div className="review-rating">
                  {Array(review.rating).fill('★').map((star, index) => (
                    <span key={index} className="review-star">{star}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentBookReviews;