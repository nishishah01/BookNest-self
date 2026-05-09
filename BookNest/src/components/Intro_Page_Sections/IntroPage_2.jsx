import React, { useState } from 'react';
import "../../styles/IntroPage_2.css";
import poster_1 from "../../book_posters/poster_1.png"
import poster_2 from "../../book_posters/poster_2.png"
import poster_3 from "../../book_posters/poster_3.png"
import poster_4 from "../../book_posters/poster_4.png"
import poster_5 from "../../book_posters/poster_5.png"

import star from "../../assets/star.svg";
import { useNavigate } from 'react-router-dom';

// Updated book data with real popular titles
const booksData = [
  { id: 1, poster: poster_1, title: "The Midnight Library", author: "Matt Haig", rating: 4.5 },
  { id: 2, poster: poster_2, title: "Where the Crawdads Sing", author: "Delia Owens", rating: 4.8 },
  { id: 3, poster: poster_3, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", rating: 4.7 },
  { id: 4, poster: poster_4, title: "Atomic Habits", author: "James Clear", rating: 4.6 },
  { id: 5, poster: poster_5, title: "The Silent Patient", author: "Alex Michaelides", rating: 4.4 }
];

const IntroPage_2 = () => {
  const navigate = useNavigate();

  const handleSeeAllClick = () => {
    navigate('/login');
  };

  return (
    <div className='intro-page-2'>
      <div className='section-header'>
        <h1 className='section-title'>Popular Books</h1>
        <p className='section-subtitle'>Discover the most loved books by our community</p>
      </div>

      <div className='content-wrapper'>
        <div className='left'>
          <div className='title'>
            <h2 className='popular_books'>Trending Now</h2>
            <button className='see-all-btn' onClick={handleSeeAllClick}>
              See All →
            </button>
          </div>

          <div className='intro-book-list'>
            <div className='popular-bg'></div>
            {booksData.slice(0, 5).map((book) => (
              <Popular_Book key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroPage_2;

const Popular_Book = ({ book }) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate('/login');
  };

  return (
    <div className='popular-book' onClick={handleBookClick}>
      <div className='book-card'>
        <div className='star-div'>
          <span className='rating-text'>{book.rating}</span>
          <img src={star} alt="star" />
        </div>
        <div className='book-poster'>
          <img src={book.poster} alt={book.title} />
          <div className='hover-overlay'>
            <span>View Details</span>
          </div>
        </div>
        <div className='book-info'>
          <h3 className='book-title'>{book.title}</h3>
          <p className='book-author'>by {book.author}</p>
        </div>
      </div>
    </div>
  );
}

const Book_2 = ({ book }) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate('/login');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <img 
          key={i} 
          src={star} 
          alt="star" 
          className={i < fullStars ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  return (
    <div className='book-2' onClick={handleBookClick}>
      <div className='book-card-2'>
        <div className='book-poster-2'>
          <img src={book.poster} alt={book.title} />
          <div className='hover-overlay-2'>
            <span>Explore Book</span>
          </div>
        </div>

        <div className='book-info-2'>
          <h3 className='book-title-2'>{book.title}</h3>
          <p className='book-author-2'>{book.author}</p>

          <div className='stars'>
            {renderStars(book.rating)}
          </div>

          <div className='recommendation-badge'>
            <span>
              Recommended <br />
              for you
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}