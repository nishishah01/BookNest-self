import IntroNavbar_1 from '../components/IntroNavbar_1';
import "../styles/BookLandingPage.css";
import book_bg from "../booklanding_assets/book1_bg.png";
import book_cover from "../booklanding_assets/book1_cover.png";
import author_img from "../booklanding_assets/author_img.png";
import star from "../assets/star.svg";
import Footer from '../components/Footer';
import BookReviews from '../components/BookReviews';
import { useState } from 'react';

const BookLandingPage = () => {

  const [ratings, setRatings] = useState(4);
  const [similarBooks, setSimilarBooks] = useState([1,2,3,4,5,6,7,8]);
  const [authorBooks, setAuthorBooks] = useState([1,2,3,4,5,6]);

  const bookData = {
    title: "Geronimo Stilton 3-in-1: The Discovery of America, The Secret of the Sphinx, and The Coliseum Con",
    cover: book_cover,
    bgImage: book_bg,
    author: {
      name: "Geronimo Stilton",
      profileImage: author_img,
      followers: 69,
      books: 420,
    },
    bookRating: 4.5,
    tags: ["Children", "Fantasy", "Adventure", "Fiction", "Chapter Books", "Mystery", "Middle Grade"]
  }


  return (
    <div className='Book-landing-page'>
      <IntroNavbar_1 />

      <div className='book-bg'> <img src={bookData.bgImage} /> </div>
      <div className='book-details-outer'>
        <img className='book_bg_2' src={bookData.bgImage} />
        <div className='blur-box'>

          <div className='book-details-inner'>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img className='book-cover-image' src={bookData.cover} />
            </div>
            <div className='book-info-2'>
              <h2 className='title'> {bookData.title} </h2>

              <div className='author-profile'>
                <img className='author-image' src={bookData.author.profileImage} />
                <div className='author-info' style={{ display: 'flex', alignItems: 'center' }}>
                  <h2 className='author-name'> {bookData.author.name} </h2>
                </div>
              </div>

              <div className='ratings'>
                {[...Array(ratings)].map((_, i) => (
                  <img src={star} />
                ))}

              </div>

              <div className='book-tags'>
                {
                  bookData.tags.map((item, index) => {
                    return <div className='tag' key={index}> {item} </div>
                  })
                }
              </div>

              <div className='button-box'>
                <button className='rent-button'>Available for Rent</button>
                <button className='buy-button'>Available for Buy</button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <BookReviews />

      <div style={{padding:'1vh 3vw'}}>
        <h3>View Similar</h3>
        <div style={{width:'100%', display:'flex', marginTop:'2vh', gap:'20px'}}>
          {
            similarBooks.map(item => {
              return <div style={{width:'100px', height:'100px', background:'gray', borderRadius:'10px'}}></div>
            })
          }
        </div>
      </div>

      <div style={{padding:'1vh 3vw'}}>
        <h3>More by this Author</h3>
        <div style={{width:'100%', display:'flex', marginTop:'2vh', gap:'20px'}}>
          {
            authorBooks.map(item => {
              return <div style={{width:'100px', height:'100px', background:'gray', borderRadius:'10px'}}></div>
            })
          }
        </div>
      </div>

      <div className="fanarts-container">
        <h1>Fanarts</h1>
        <div className="fanarts-row-div">
          <div className="fanarts-col-div">
            <div className="short-fanart"></div>
            <div className="long-fanart"></div>
          </div>
          <div className="fanarts-col-div">
            <div className="long-fanart"></div>
            <div className="short-fanart"></div>
          </div>
          <div className="fanarts-col-div">
            <div className="short-fanart"></div>
            <div className="long-fanart"></div>
          </div>
          <div className="fanarts-col-div">
            <div className="long-fanart"></div>
            <div className="short-fanart"></div>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default BookLandingPage;
