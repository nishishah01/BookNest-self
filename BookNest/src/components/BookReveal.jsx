import React, { useEffect, useState, useContext } from "react";
import "../styles/BookReveal.css";
import door from "../assets/door.png";
import book_cover from "../assets/poster_1.jpeg";
import SpinningWheel from "./SpinningWheel";
import { useSpin } from "../context/SpinContext"; 

const BookReveal = () => {
  const { hasSpin } = useSpin();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(()=>{
    if(hasSpin == true) {
        setIsRevealed(true)
    }
  }, [hasSpin])

  return (
    <div className="book-reveal-container">
      <div className="door-spin-wrapper">
        <div className={`door-frame ${isRevealed ? "door-opened" : ""}`}>
          <div className={`door ${isRevealed ? "open" : ""}`}>
            <img src={door} alt="Closed Door" className="door-image" />
          </div>
          
          <div className={`book ${isRevealed ? "show" : ""}`}>
            <img src={book_cover} alt="Recommended Book" className="book-image" />
          </div>
        </div>

        <SpinningWheel />
      </div>
    </div>
  );
};

export default BookReveal;