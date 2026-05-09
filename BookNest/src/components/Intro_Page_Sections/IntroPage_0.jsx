import React, { useEffect, useRef } from 'react';
import poster_1 from "../../book_posters/poster_1.png"
import poster_2 from "../../book_posters/poster_2.png"
import poster_3 from "../../book_posters/poster_3.png"
import poster_4 from "../../book_posters/poster_4.png"
import poster_5 from "../../book_posters/poster_5.png"
import poster_6 from "../../book_posters/poster_6.png"
import poster_7 from "../../book_posters/poster_7.png"
import poster_8 from "../../book_posters/poster_8.jpeg"
import poster_9 from "../../book_posters/poster_9.png"
import poster_10 from "../../book_posters/poster_10.png"
import poster_11 from "../../book_posters/poster_11.png"
import poster_12 from "../../book_posters/poster_12.png"
import poster_13 from "../../book_posters/poster_13.png"
import poster_14 from "../../book_posters/poster_14.png"
import logo from "../../assets/logo.png"

const bookCovers = [poster_1, poster_2, poster_3,poster_4,poster_5,poster_6,poster_7,poster_8,poster_9,poster_10,poster_11,poster_12,poster_13,poster_14];

const InfiniteScrollRow = ({ reverse = false }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    let scrollAmount = 0.5;
    const scroll = () => {
      if (reverse) {
        scrollElement.scrollLeft -= scrollAmount;
        if (scrollElement.scrollLeft <= 0) {
          scrollElement.scrollLeft = scrollElement.scrollWidth / 2;
        }
      } else {
        scrollElement.scrollLeft += scrollAmount;
        if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
          scrollElement.scrollLeft = 0;
        }
      }
      requestAnimationFrame(scroll);
    };
    scroll();
  }, [reverse]);
  return (
    <div
      ref={scrollRef}
      className="flex overflow-hidden whitespace-nowrap w-full"
      style={{ height: '300px', gap:'30px' }}
    >
      {[...bookCovers, ...bookCovers].map((cover, index) => (
        <img
          key={index}
          src={cover}
          alt={`book-${index}`}
          style={{ height: '90%', width: '180px', objectFit: 'cover' }}
          className="mx-2"
        />
      ))}
    </div>
  );
};

const IntroPage_0 = () => {
  return (
    <div style={{position:'relative', top:'20px',paddingBottom:'80px'}} className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <div className="w-full overflow-hidden">
        <InfiniteScrollRow />
      </div>

      // This should be absolute on the top with blur transparent background
      <div style={{padding:'30px', display:'flex', flexDirection:'column', alignItems:'center', background:'#ffeee4b3', backdropFilter:'blur(10px)'}} className="absolute bg-white z-10 p-10 shadow-lg w-[55%] max-w-4xl -mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome To</h1>
        <img style={{width:'172px', height:'69px'}} src={logo} />
        <p style={{width:'80%'}} className="mb-6 text-lg">Your one-stop destination to explore, rent and sell books effortlessly</p>
      </div>

      <div className="w-full overflow-hidden mt-10">
        <InfiniteScrollRow reverse={true} />
      </div>
    </div>
  );
};

export default IntroPage_0;