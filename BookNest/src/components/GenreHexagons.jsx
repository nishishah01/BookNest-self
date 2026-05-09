import { useState } from "react";
import Cookies from "js-cookie";

// Mock components for GenreBasedBooks and AnimatedList
const GenreBasedBooks = () => <div className="my-4 p-4 bg-gray-100 rounded">Genre Based Books Component</div>;
const AnimatedList = ({ items, onItemSelect, showGradients, enableArrowNavigation, displayScrollbar }) => (
    <div className="w-full max-w-md">
        {items.map((item, index) => (
            <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => onItemSelect(item, index)}>
                {item}
            </div>
        ))}
    </div>
);

const GenreHexagons = () => {
    const [hoveredHex, setHoveredHex] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hexagons = [
        { id: "Fantasy", row: 0, col: 0, color: "#7F00FF" },
        { id: "Science Fiction", row: 0, col: 1, color: "#00CED1" },
        { id: "Mystery", row: 0, col: 2, color: "#4B0082" },
        { id: "Thriller", row: 0, col: 3, color: "#DC143C" },
        { id: "Romance", row: 0, col: 4, color: "#FF69B4" },
        { id: "Poetry", row: 1, col: 0, color: "#BA55D3" },
        { id: "Horror", row: 1, col: 1, color: "#8B0000" },
        { id: "Young Adult", row: 1, col: 2, color: "#FFA500" },
        { id: "Dystopian", row: 1, col: 3, color: "#696969" },
        { id: "Biography", row: 2, col: 0, color: "#2E8B57" },
        { id: "Self-Help", row: 2, col: 1, color: "#00BFFF" },
        { id: "Graphic Novels", row: 2, col: 2, color: "#FF4500" },
        { id: "Adventure", row: 2, col: 3, color: "#228B22" },
        { id: "Comedy", row: 2, col: 4, color: "#FFD700" },
    ];

    const remainingGenres = [
        "Contemporary Fiction",
        "Children's Book",
        "Historical Fiction",
        "Non-fiction",
        "Spirituality / Religion",
        "Classic Literature"
    ];

    const fetchBooks = async (genre) => {
        setLoading(true);
        setError(null);

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.endsWith('/') ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL + '/') : "http://localhost:8000/";
            const response = await fetch(`${baseUrl}base/discover/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({ genre }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            // Mock data for demonstration when API is not available
            setBooks([
                { id: 1, title: `Sample ${genre} Book 1`, author: "Author Name", rating: 4.5 },
                { id: 2, title: `Sample ${genre} Book 2`, author: "Another Author", rating: 4.2 },
                { id: 3, title: `Sample ${genre} Book 3`, author: "Third Author", rating: 4.8 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
        fetchBooks(genre);
    };

    const hexWidth = 140;
    const hexHeight = 160;
    const horizontalSpacing = hexWidth;
    const verticalSpacing = hexHeight * 0.75;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full flex justify-center">
                <div
                    className="relative mx-auto"
                    style={{ width: `${hexWidth * 5}px`, height: `${hexHeight * 3}px` }}
                >
                    {hexagons.map((hexagon) => {
                        const isOddRow = hexagon.row % 2 === 1;
                        const left = hexagon.col * horizontalSpacing + (isOddRow ? horizontalSpacing / 2 : 0);
                        const top = hexagon.row * verticalSpacing;

                        return (
                            <div
                                key={hexagon.id}
                                style={{
                                    position: "absolute",
                                    left: `${left}px`,
                                    top: `${top}px`,
                                }}
                            >
                                <Hexagon
                                    id={hexagon.id}
                                    isHovered={hoveredHex === hexagon.id}
                                    isSelected={selectedGenre === hexagon.id}
                                    onHover={setHoveredHex}
                                    onClick={handleGenreClick}
                                    color={hexagon.color}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{display:'flex'}}>
                {books ? books.map((book, key) => (
                    <div className="book-card">
                        <div className="book-info">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">{book.author}</p>
                        </div>
                        <div className="book-cover-container">
                            <img
                                src={book.cover || book.coverImage}
                                alt={book.title}
                                className="book-cover"
                            />
                        </div>
                    </div>
                )) : <p style={{color:'red'}}>We are facing server issue for fetching books</p>}
            </div>
        </div>
    );
};

function Hexagon({ id, isHovered, isSelected, onHover, onClick, color }) {
    const shouldGlow = isHovered || isSelected;
    const glowStyle = shouldGlow ? {
        filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color}60)`,
        transform: 'scale(1.05)'
    } : {};

    return (
        <div
            className="relative w-[140px] h-[160px] cursor-pointer"
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(id)}
            style={{ zIndex: shouldGlow ? 10 : 1 }}
        >
            {/* Outer glow effect */}
            {shouldGlow && (
                <div
                    className={`absolute inset-0 -z-10 rounded-full blur-lg opacity-40 ${isSelected ? 'animate-pulse' : ''}`}
                    style={{
                        background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                        transform: 'scale(1.2)',
                    }}
                />
            )}

            {/* Main hexagon */}
            <div
                className="absolute inset-0 transition-all duration-300"
                style={glowStyle}
            >
                <svg width="100%" height="100%" viewBox="0 0 100 115" preserveAspectRatio="none">
                    <defs>
                        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <polygon
                        points="50 0, 100 28.75, 100 86.25, 50 115, 0 86.25, 0 28.75"
                        fill="white"
                        stroke={shouldGlow ? color : "#374151"}
                        strokeWidth={shouldGlow ? "3" : "2"}
                        filter={shouldGlow ? `url(#glow-${id})` : "none"}
                        style={{
                            transition: 'all 0.3s ease',
                        }}
                    />
                    <text
                        x="50"
                        y="65"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="text-lg font-bold pointer-events-none"
                        style={{
                            fontSize: "13px",
                            fill: shouldGlow ? color : "black",
                            transition: 'fill 0.3s ease',
                            fontWeight: shouldGlow ? '700' : '600'
                        }}
                    >
                        {id}
                    </text>
                </svg>
            </div>
        </div>
    );
}

export default GenreHexagons;