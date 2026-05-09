import React, { useCallback, useEffect, useState } from 'react'
import search from "../assets/search.svg"
import { ChevronDown, Filter, X, SlidersHorizontal } from 'lucide-react';
import poster_1 from "../assets/poster_1.jpeg";
import poster_2 from "../book_posters/poster_2.png";
import poster_3 from "../book_posters/poster_3.png";
import poster_4 from "../book_posters/poster_4.png";
import poster_5 from "../book_posters/poster_5.png";
import poster_6 from "../book_posters/poster_6.png";
import poster_7 from "../book_posters/poster_7.png";
import poster_8 from "../book_posters/poster_8.jpeg";
import Footer from "../components/Footer"
import MainNavbar from '../components/MainNavbar';
import { buys } from "../apis/buy.api";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const BuyOnlyPage = () => {
  const navigate = useNavigate();
  // BOOKS DATA
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

  const [searchVal, setSearchVal] = useState("");
  const [buyBooks, setBuyBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Lifting state up
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    price: "",
    location: "",
    hasImage: false,
    isAvailable: false
  });

  // Sort options array
  const sortOptions = [
    { value: "rating", label: "Rating (High to Low)" },
    { value: "price_low_to_high", label: "Price (Low to High)" },
    { value: "nearest", label: "Nearest" }
  ];

  const [activeSort, setActiveSort] = useState("rating");

  const handleSearchValue = (e) => {
    setSearchVal(e.target.value);
  }

  // Updated buildQueryParams function
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Add search query if exists
    if (searchVal.trim()) {
      params.append('search_query', searchVal.trim());
    }

    // Price filter
    if (filters.price) {
      params.append('price_limit', filters.price);
    }

    // Has image filter
    if (filters.hasImage) {
      params.append('has_image', 'true');
    }

    // Sort options
    if (activeSort) {
      params.append('ordering', activeSort);
    }

    return params.toString();
  }, [searchVal, filters, activeSort]);

  // Updated fetchBuyBooks function
  const fetchBuyBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams();
      const url = `${buys}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBuyBooks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching buy books:', err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Effect to fetch buy books when filters or search changes
  useEffect(() => {
    fetchBuyBooks();
  }, [fetchBuyBooks]);

  // Handle search button click
  const handleSearch = () => {
    fetchBuyBooks();
  }

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setActiveSort(sortValue);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleOptionSelect = (id, value) => {
    setFilters({
      ...filters,
      [id]: value
    });
    setActiveDropdown(null);
  };

  const handleCheckboxChange = (id) => {
    setFilters({
      ...filters,
      [id]: !filters[id]
    });
  };

  // Toggle drawer function
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      price: "",
      location: "",
      hasImage: false,
      isAvailable: false
    });
    setActiveSort("rating");
    setSearchVal("");
  };

  const handleBuyDetails = () => {
    navigate('/buy-details');
  };

  return (
    <div className='discover-books-page'>
      <div className='header'>
        <h1 style={{ color: '#8b4513', fontSize: '30px', fontFamily: 'Raleway', fontWeight: '600' }}>Books For Buy</h1>
        <p style={{ color: '#b08068', fontSize: '18px' }}>Build your personal library — buy books you love, yours to keep forever!</p>
        <div className='search-input'>
          <img src={search} alt="Search icon" />
          <input
            type="text"
            placeholder='Search title, authors, genres'
            value={searchVal}
            onChange={handleSearchValue}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleDrawer}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-amber-100"
          style={{
            border: '2px solid #f59e0b',
            color: '#f59e0b',
            fontWeight: '600',
            backgroundColor: isDrawerOpen ? '#fff8e6' : 'white',
            padding: '1vh 1vw'
          }}
        >
          {isDrawerOpen ? (
            <>
              <X size={18} />
              Close Filters & Sort
            </>
          ) : (
            <>
              <Filter size={18} />
              Open Filters & Sort
            </>
          )}
        </button>
      </div>

      {/* FILTERS & SORT DRAWER */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden bg-white rounded-lg shadow-md mb-6"
        style={{
          overflow: isDrawerOpen ? 'visible' : 'hidden',
          maxHeight: isDrawerOpen ? '500px' : '0',
          opacity: isDrawerOpen ? 1 : 0,
          padding: isDrawerOpen ? '20px' : '0 20px',
          marginBottom: isDrawerOpen ? '24px' : '0',
          width: '90%',
          margin: '0 auto',
          border: isDrawerOpen ? '1px solid #e5e7eb' : 'none',
        }}
      >

        <div className="flex flex-col md:justify-between">
          {/* FILTERS SECTION */}
          <div className="flex-1 mb-6 md:mb-0 md:mr-8">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ marginBottom: '10px' }} className="text-xl font-semibold text-amber-800 flex items-center">
                <Filter size={18} className="inline mr-2" />
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-amber-600 hover:text-amber-800 underline"
              >
                Reset All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <CustomDropdown
                id="price"
                label="Price Range"
                options={[
                  { value: "", label: "Any" },
                  { value: "50", label: "< 50" },
                  { value: "100", label: "< 100" },
                  { value: "200", label: "< 200" }
                ]}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                selectedValue={filters.price}
                onSelect={handleOptionSelect}
              />

              <div style={{ marginTop: '20px' }} className="flex gap-6 items-center mt-4">
                <CustomCheckbox
                  label="Has Image"
                  id="hasImage"
                  checked={filters.hasImage}
                  onChange={() => handleCheckboxChange("hasImage")}
                />
              </div>
            </div>
          </div>

          {/* VERTICAL DIVIDER */}
          <div style={{ margin: '0px 20px' }} className="hidden md:block w-px bg-gray-200 mx-4"></div>

          {/* SORTING SECTION */}
          <div style={{ marginTop: '20px' }} className="flex-1 md:ml-8">
            <h2 style={{ marginBottom: '10px' }} className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
              <SlidersHorizontal size={18} className="inline mr-2" />
              Sort By
            </h2>

            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    backgroundColor: activeSort === option.value ? "#f59e0b" : "#f3f4f6",
                    color: activeSort === option.value ? "white" : "#374151",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: activeSort === option.value ? "0 2px 4px rgba(245, 158, 11, 0.3)" : "none"
                  }}
                  className="hover:shadow-sm"
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOOKS DISPLAYING */}
      <div style={{
        display: 'flex',
        width: '80%',
        margin: '0 auto',
        flexWrap: 'wrap',
        justifyContent: 'left',
        gap: '10px',
        marginBottom: '50px'
      }}>
        {loading ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
            Loading...
          </div>
        ) : buyBooks.length > 0 ? (
          buyBooks.map((book, index) => (
            <Card 
              key={index} 
              title={book.title} 
              author={book.author} 
              bg={book.cover_image || poster_1} 
              rating={book.rating} 
              price={book.price}
              onClick={handleBuyDetails}
            />
          ))
        ) : (
          <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
            No books found
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

const CustomCheckbox = ({ label, id, checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <div style={{ gap: '5px' }} className="relative flex items-center">
      <input
        type="checkbox"
        className="absolute opacity-0 w-5 h-5 cursor-pointer"
        checked={checked}
        onChange={onChange}
        id={id}
      />
      <div className={`w-5 h-5 border-2 border-amber-500 rounded mr-2 ${checked ? 'bg-amber-500' : ''}`}>
        {checked && (
          <svg className="w-3 h-3 text-white absolute left-1 top-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  </label>
);

const CustomDropdown = ({
  id,
  label,
  options,
  activeDropdown,
  toggleDropdown,
  selectedValue,
  onSelect
}) => {
  // Find selected option label
  const selectedOption = options.find(option => option.value === selectedValue) || options[0];

  return (
    <div style={{ marginTop: '5px', marginBottom: '5px', zIndex: '200' }} className="relative">
      <label style={{ color: '#555', display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }} className="block text-sm font-medium mb-1">{label}</label>
      <button
        onClick={() => toggleDropdown(id)}
        style={{
          width: '100%',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        className="hover:bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedOption.label}</span>
        <ChevronDown size={16} style={{
          transition: 'transform 0.2s ease',
          transform: activeDropdown === id ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </button>

      {activeDropdown === id && (
        <div style={{
          position: 'absolute',
          zIndex: '999',
          width: '100%',
          marginTop: '4px',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          
          {options.map((option, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                borderBottom: index === options.length - 1 ? 'none' : '1px solid #f3f4f6'
              }}
              className="hover:bg-amber-50"
              onClick={() => onSelect(id, option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Card = ({ title, author, bg, rating, price, onClick }) => {
  return (
    <div 
      className="transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
      style={{
        width: '160px',
        minHeight: 'fit-content',
        border: '1px solid #e5e7eb',
        padding: '12px',
        background: 'white',
        borderRadius: '10px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
      onClick={onClick}
    >
      <img src={bg} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }} />
      <h1 style={{ fontWeight: '600', marginTop: '8px', color: '#4b5563' }}>{title}</h1>
      <h2 style={{ fontSize: '14px', color: '#6b7280' }}>By: {author}</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ color: '#f59e0b', marginRight: '4px' }}>★</span>
        <span style={{ fontSize: '14px', color: '#4b5563' }}>{rating}</span>
      </div>
      {price && (
        <div style={{ marginTop: '8px', color: '#8b4513', fontWeight: '600' }}>
          ₹{price}
        </div>
      )}
    </div>
  );
}

export default BuyOnlyPage