import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SERVER_API from "../apis/server.api";
import Footer from '../components/Footer';
import MainNavbar from '../components/MainNavbar';
import BuyOnlyPage from '../pages/BuyOnlyPage';
import RentOnlyPage from '../pages/RentOnlyPage';
import "../styles/RentBuy.css";

const RentBuyBooks = () => {
  const [bookData, setBookData] = useState([]);
  const [view, setView] = useState('all'); 
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const createButtonRef = useRef(null);
  const navigate = useNavigate();

  // Removed dummy array

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${SERVER_API}base/rent_buy_common`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setBookData(data.results || []);
      } catch (error) {
        console.error('Failed to fetch books:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCreateModal && !event.target.closest('.create-modal-overlay')) {
        setShowCreateModal(false);
      }
    };

    if (showCreateModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateModal]);

  const handleCreateClick = () => {
    setShowCreateModal(!showCreateModal);
  };

  const handleCreateRent = () => {
    navigate('/rent-form');
  };

  const handleCreateSell = () => {
    console.log("Create a sell");
    setShowCreateModal(false);
    // Add your navigation logic here
  };

  const renderContent = () => {
    if (view === 'rent') return <RentOnlyPage />;
    if (view === 'buy') return <BuyOnlyPage />;
    return (
      <div className="books-grid">
        {bookData.length > 0 ? (
          bookData.map((book, index) => (
            <BookCard 
              key={index} 
              book={{
                title: book.title || "Unknown Title",
                author: book.author || "Unknown Author",
                coverImage: book.image || book.cover || "https://m.media-amazon.com/images/I/61QR7qoEYVL._AC_UF1000,1000_QL80_.jpg",
                sellerName: book.user_name || book.username || "User",
                sellerRating: book.user_avg_rating || "N/A",
                type: book.type
              }} 
              isPurpleBoxRent={book?.type === 'rent'} 
            />
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
             <p>No books available. Try adjusting your search or filters, or create a new listing!</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rentbuy-container">
      <MainNavbar />

      <div className="rentbuy-content">
        <div className="rentbuy-header">
          <h1 className="rentbuy-title">Rent/Buy Books</h1>

          <div className="rentbuy-filters">
            <button
              className={`filter-button ${view === 'rent' ? 'active' : ''}`}
              onClick={() => setView('rent')}
            >
              Rent
            </button>
            <button
              className={`filter-button ${view === 'buy' ? 'active' : ''}`}
              onClick={() => setView('buy')}
            >
              Buy
            </button>
            <button
              className={`filter-button ${view === 'all' ? 'active' : ''}`}
              onClick={() => setView('all')}
              style={view === 'all' ? { background: 'rgb(247, 148, 121)', color: 'white' } : {}}
            >
              All
            </button>
            <button 
              className="filter-button"
              onClick={handleCreateClick}
              ref={createButtonRef}
            >
              Create
            </button>
          </div>
        </div>

        {loading ? <p>Loading...</p> : renderContent()}
      </div>

      {/* Absolute positioned modal */}
      {showCreateModal && (
        <div className="create-modal-overlay">
          <div className="create-modal-window">
            <div className="modal-header">
              <h3>Create New Listing</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <button 
                className="modal-option-btn"
                onClick={handleCreateRent}
              >
                <div className="option-icon">📚</div>
                <div className="option-text">
                  <strong>Create a Rent</strong>
                  <span>List your book for rental</span>
                </div>
              </button>
              <button 
                className="modal-option-btn"
                onClick={handleCreateSell}
              >
                <div className="option-icon">💰</div>
                <div className="option-text">
                  <strong>Create a Sell</strong>
                  <span>List your book for sale</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const BookCard = ({ book, isPurpleBoxRent }) => {
  const handleRentDetails = () => {
    console.log("Navigate to rent details");
  };

  const handleBuyDetails = () => {
    console.log("Navigate to buy details");
  };

  return (
    <div className="book-card">
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
      </div>
      <div className="book-cover-container">
        <img
          src={book.coverImage}
          alt={book.title}
          className="book-cover"
        />
      </div>
      <div className={`seller-info-box ${isPurpleBoxRent ? 'rent-box' : 'buy-box'}`}>
        <p className="seller-name">Seller Name: {book.sellerName}</p>
        <p className="seller-rating">
          Seller Rating: {book.sellerRating}
          <span className="rating-star"> ★</span>
        </p>
      </div>
      <div className="card-actions">
        <button className="action-button" onClick={handleRentDetails}>Rent</button>
        <button className="action-button" onClick={handleBuyDetails}>Buy</button>
      </div>
    </div>
  );
};

export default RentBuyBooks;