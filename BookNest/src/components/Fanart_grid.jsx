import { useState } from 'react';
import "../styles/Fanart-grid.css"

const Fanart_grid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Gallery items data
  const galleryItems = [
    { id: 1, title: 'Wizards Tower', likes: 42, color: 'green' },
    { id: 2, title: 'Wizards Tower', likes: 47, color: 'pink' },
    { id: 3, title: '', likes: 0, color: 'green' },
    { id: 4, title: '', likes: 0, color: 'pink' },
    { id: 5, title: '', likes: 0, color: 'pink' },
    { id: 6, title: '', likes: 0, color: 'green' },
    { id: 7, title: '', likes: 0, color: 'pink' },
    { id: 8, title: '', likes: 0, color: 'green' }
  ];

  return (
    <div className="wt-gallery-container">
      <div className="wt-gallery-grid">
        {galleryItems.map((item) => (
          <div key={item.id} className="wt-gallery-item">
            <div 
              className={`wt-gallery-image ${item.color === 'green' ? 'wt-green-bg' : 'wt-pink-bg'}`}
            >
              {item.id <= 2 && (
                <span className="wt-gallery-username">artlover22</span>
              )}
            </div>
            {item.title && (
              <div className="wt-gallery-footer">
                <h3 className="wt-gallery-title">{item.title}</h3>
                <div className="wt-gallery-likes">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="wt-heart-icon"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span className="wt-likes-count">{item.likes}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="wt-pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`wt-page-button ${currentPage === page ? 'wt-active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Fanart_grid;