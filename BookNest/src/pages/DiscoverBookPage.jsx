import React from 'react'
import "../styles/DiscoverBooks.css";
import search from "../assets/search.svg";
import GenreHexagons from '../components/GenreHexagons';
import Footer from "../components/Footer.jsx";
import MainNavbar from '../components/MainNavbar.jsx';

const DiscoverBookPage = () => {
    return (
        <div className='discover-books-page'>
            <MainNavbar />
            <div className='header'>
                <h1 style={{color:'#8b4513', fontSize:'30px', fontFamily:'Raleway', fontWeight:'600'}}>Discover Books</h1>
                <p style={{color:'#b08068', fontSize:'18px'}}>Not sure what to read next? Start your book discovery journey here!</p>
                <div className='search-input'>
                    <img src={search} />
                    <input
                        type = "text"
                        placeholder='Search title, authors, genres'
                    />
                </div>
            </div>

            <h1 style={{color:'#8b4513', fontSize:'30px', fontFamily:'Raleway', fontWeight:'600', textAlign:'center', marginTop:'30px', marginBottom:'30px'}}>Genres</h1>

            <GenreHexagons />

            <Footer />
        </div>
    )
}

export default DiscoverBookPage
