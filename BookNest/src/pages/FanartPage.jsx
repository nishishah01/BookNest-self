import React, { useState } from 'react';
import "../styles/FanartPage.css";
import Fanart_grid from "../components/Fanart_grid.jsx"
import FanartUploadForm from '../components/ShareFanart_Form.jsx';
import MainNavbar from '../components/MainNavbar.jsx';

const FanartPage = () => {

    const [genre, setGenre] = useState("For You");

    const handleGenre = (genre_name) => {
        setGenre(genre_name);
    };

    return (
        <div className='fanart-page'>
            <MainNavbar />

            <div className='header'>
                <div className='text-box'>
                    <h1>Fanart Gallery</h1>
                    <h4>Share your creativity inspired by your favourite books</h4>
                </div>
                <button>Submit Fanart</button>
            </div>

            <div className='genre-tabs' style={{marginTop:'5vh'}}>
                {["For You", "Thrill", "Romance", "Sci-Fi", "Novel", "Self Help", "Biography"].map((g) => (
                    <h3
                        key={g}
                        className='genre'
                        onClick={() => handleGenre(g)}
                        style={{
                            background: genre === g ? "rgba(160, 94, 77, 1)" : "transparent",
                            color: genre === g ? "white" : "black",
                            padding: "10px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "all 0.5s ease"
                        }}
                    >
                        {g}
                    </h3>
                ))}
            </div>

            <Fanart_grid />

            <FanartUploadForm />

        </div>
    )
}

export default FanartPage
