import React, { useState } from 'react';
import "../styles/ShelfBox.css";

const HomeBookLists = () => {
  const [genre, setGenre] = useState("For You");

  const [books, setBooks] = useState([1,2,3,4,5,6]);

  const handleGenre = (genre_name) => {
    setGenre(genre_name);
  };

  return (
    <div className='Home_Book_List_container'>
      <div className='book-list-section'>
        <h1>What Your Friends are Reading</h1>
        
        <div className='book-list-3'>
          {books.map((item, key) => (
            <div key={key} className='book-in-list'></div>
          ))}
        </div>
      </div>

      <div className='book-list-section'>
        <h1>Hottest Books</h1>
        
        <div className='book-list-3'>
          {books.map((item, key) => (
            <div key={key} className='book-in-list'></div>
          ))}
        </div>
      </div>

      <div className='book-list-section'>
        <h1>Books By Authors You Like</h1>
        
        <div className='book-list-3'>
          {books.map((item, key) => (
            <div key={key} className='book-in-list'></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBookLists;
