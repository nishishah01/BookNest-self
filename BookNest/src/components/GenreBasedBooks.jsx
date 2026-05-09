import React, { useState } from 'react'
import poster_1 from "../assets/poster_1.jpeg";
import poster_2 from "../book_posters/poster_2.png";
import poster_3 from "../book_posters/poster_3.png";
import poster_4 from "../book_posters/poster_4.png";
import poster_5 from "../book_posters/poster_5.png";
import poster_6 from "../book_posters/poster_6.png";
import poster_7 from "../book_posters/poster_7.png";
import poster_8 from "../book_posters/poster_8.jpeg";
import star from "../assets/star.svg";

const GenreBasedBooks = () => {

    const [books, setBooks] = useState([
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_1,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_2,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_3,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_4,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_5,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_6,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_7,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_8,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_1,
            rating: 4.3,
        },
        {
            title: "BookNest",
            author: 'Nishi Pawar',
            bg: poster_2,
            rating: 4.3,
        },

    ]);

    return (
        <div style={{display:'flex', width:'80%', margin:'0vh auto', flexWrap:'wrap', justifyContent:'space-between', gap:'10px'}}>
            {
                books.map(item => {
                    return <Card title={item.title} author={item.author} bg={item.bg} rating={item.rating} />
                })
            }
        </div>
    )
}

const Card = ({title, author, bg, rating}) => {
    return (
        <div className="transition-transform duration-300 hover:scale-101" style={{width:'160px', height:'300px', border:'1px solid gray', padding:'1vh 1vw', background:'rgb(241, 241, 241)', borderRadius:'10px', }}>
            <img src={bg} style={{width:'100%', height:'80%'}} />
            <h1 style={{fontWeight:'600'}}>{title}</h1>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <h2>{author}</h2>
                <p style={{display:'flex'}}>{rating}
                    <img src={star} />
                </p>
            </div>
        </div>
    );
}

export default GenreBasedBooks
