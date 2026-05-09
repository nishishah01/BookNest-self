import Cookies from "js-cookie";
import { ChevronDown, Filter, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rents } from "../apis/rent.api";
import poster_1 from "../assets/poster_1.jpeg";
import search from "../assets/search.svg";
import poster_2 from "../book_posters/poster_2.png";
import poster_3 from "../book_posters/poster_3.png";
import poster_4 from "../book_posters/poster_4.png";
import poster_5 from "../book_posters/poster_5.png";
import poster_6 from "../book_posters/poster_6.png";
import poster_7 from "../book_posters/poster_7.png";
import poster_8 from "../book_posters/poster_8.jpeg";
import Footer from "../components/Footer";

const RentOnlyPage = () => {
  const navigate = useNavigate();
  
  // Fallback books data for when API fails
  const [fallbackBooks] = useState([
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
  ]);

  const [searchVal, setSearchVal] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter and sort states
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    price: "",
    deposit: "",
    depositRange: "",
    location: "",
    hasImage: false,
    isAvailable: false
  });

  // Updated sort options to match API
  const sortOptions = [
    { value: "rating", label: "Rating (High to Low)" },
    { value: "price_low_to_high", label: "Price (Low to High)" },
    { value: "deposit_low_to_high", label: "Deposit (Low to High)" },
    { value: "nearest", label: "Nearest" }
  ];

  const [activeSort, setActiveSort] = useState("rating");

  const handleSearchValue = (e) => {
    setSearchVal(e.target.value);
  }

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchVal.trim()) {
      params.append('search_query', searchVal.trim());
    }

    if (filters.price) {
      params.append('price_limit', filters.price);
    }

    if (filters.depositRange) {
      params.append('deposit_limit', filters.depositRange);
    }

    if (filters.deposit) {
      const hasDeposit = filters.deposit === 'yes' ? 'true' : 'false';
      params.append('has_deposit', hasDeposit);
    }
    //image
    if (filters.hasImage) {
      params.append('has_image', 'true');
    }

    //availible
    if (filters.isAvailable) {
      params.append('available', 'true');
    }

    // Sorting - using ordering parameter
    if (activeSort) {
      params.append('ordering', activeSort);
    }

    return params.toString();
  }, [searchVal, filters, activeSort]);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams();
      const url = `${rents}${queryParams ? `?${queryParams}` : ''}`;

      console.log('Fetching from URL:', url);

      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access this resource.');
        } else if (response.status === 404) {
          throw new Error('Rental service not found.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Fetched rentals:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setRentals(data);
      } else if (data.results && Array.isArray(data.results)) {
        // Handle paginated response
        setRentals(data.results);
      } else if (data.data && Array.isArray(data.data)) {
        // Handle wrapped response
        setRentals(data.data);
      } else {
        console.warn('Unexpected response structure:', data);
        setRentals([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rentals:', err);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleSearch = () => {
    fetchRentals();
  }

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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      price: "",
      deposit: "",
      depositRange: "",
      location: "",
      hasImage: false,
      isAvailable: false
    });
    setActiveSort("rating");
    setSearchVal("");
  };

  // Handle navigation to rent details with rental ID
  const handleRentDetails = (rentalId) => {
    if (rentalId) {
      navigate(`/rent-details/${rentalId}`);
    } else {
      navigate('/rent-details');
    }
  }

  // Retry function for when there's an error
  const handleRetry = () => {
    setError(null);
    fetchRentals();
  };

  return (
    <div className='discover-books-page'>
      <div className='header'>
        <h1 style={{ color: '#8b4513', fontSize: '30px', fontFamily: 'Raleway', fontWeight: '600' }}>Books For Rent</h1>
        <p style={{ color: '#b08068', fontSize: '18px' }}>Discover your next great read — rent books easily and affordably!</p>
        <div className='search-input'>
          <img src={search} alt="Search icon" />
          <input
            type="text"
            placeholder='Search title'
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
        <div className="flex flex-col md:flex-row md:justify-between">
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
                  { value: "50", label: "< ₹50" },
                  { value: "100", label: "< ₹100" },
                  { value: "200", label: "< ₹200" },
                  { value: "500", label: "< ₹500" }
                ]}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                selectedValue={filters.price}
                onSelect={handleOptionSelect}
              />

              <CustomDropdown
                id="deposit"
                label="Has Deposit"
                options={[
                  { value: "", label: "Any" },
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" }
                ]}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                selectedValue={filters.deposit}
                onSelect={handleOptionSelect}
              />

              <CustomDropdown
                id="depositRange"
                label="Deposit Range"
                options={[
                  { value: "", label: "Any" },
                  { value: "100", label: "< ₹100" },
                  { value: "250", label: "< ₹250" },
                  { value: "400", label: "< ₹400" },
                  { value: "1000", label: "< ₹1000" }
                ]}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                selectedValue={filters.depositRange}
                onSelect={handleOptionSelect}
              />

              <CustomDropdown
                id="location"
                label="Location"
                options={[
                  { value: "", label: "Any" },
                  { value: "mumbai", label: "Mumbai" },
                  { value: "delhi", label: "Delhi" },
                  { value: "bangalore", label: "Bangalore" },
                  { value: "pune", label: "Pune" },
                  { value: "hyderabad", label: "Hyderabad" }
                ]}
                activeDropdown={activeDropdown}
                toggleDropdown={toggleDropdown}
                selectedValue={filters.location}
                onSelect={handleOptionSelect}
              />
            </div>

            <div style={{ marginTop: '20px' }} className="flex gap-6 items-center mt-4">
              <CustomCheckbox
                label="Has Image"
                id="hasImage"
                checked={filters.hasImage}
                onChange={() => handleCheckboxChange("hasImage")}
              />
              <CustomCheckbox
                label="Available Now"
                id="isAvailable"
                checked={filters.isAvailable}
                onChange={() => handleCheckboxChange("isAvailable")}
              />
            </div>
          </div>

          {/* VERTICAL DIVIDER */}
          <div style={{ margin: '0px 20px' }} className="hidden md:block w-px bg-gray-200 mx-4"></div>

          {/* SORTING SECTION */}
          <div className="flex-1 md:ml-8">
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

      {/* ERROR DISPLAY */}
      {error && (
        <div className="text-center w-full mb-6">
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            margin: '0 auto',
            maxWidth: '80%'
          }}>
            <p style={{ marginBottom: '8px' }}><strong>Error:</strong> {error}</p>
            <button
              onClick={handleRetry}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* BOOKS DISPLAYING */}
      <div style={{
        display: 'flex',
        width: '90%',
        margin: '0 auto',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '10px',
        marginBottom: '50px'
      }}>
        {loading ? (
          <div className="text-center w-full">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px'
            }}>
              <div style={{
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #f59e0b',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }}></div>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading rentals...</p>
            </div>
          </div>
        ) : rentals.length > 0 ? (
// condition +
// deposit +
// image +
// lat
// lng
// owner_average_rating +
// price_per_day +
// rent_id + 
// status +
// title +
// user -
// user_name +
          rentals.map((item, index) => {
            return (
              <Card 
                key={item.id || index} 
                id={item.rent_id}
                title={item.title || item.book_title || 'Unknown Title'} 
                author={item.user_name || item.owner || item.rented_by || 'Unknown Author'} 
                bg={item.image || item.book_image || item.bg} 
                rating={item.owner_average_rating || 4}
                price={item.price_per_day}
                deposit={item.deposit}
                condition={item.condition}
                status={item.status}
                onRentDetails={handleRentDetails}
              />
            );
          })
        ) : !loading && !error ? (
          <div className="text-center w-full">
            <div style={{
              padding: '40px',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>No rentals found</p>
              <p style={{ fontSize: '14px' }}>Try adjusting your search or filters</p>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
      
      {/* Add keyframes for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

//////////////////////////////////////////////////////////////////////////////////
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
  const selectedOption = options.find(option => option.value === selectedValue) || options[0];

  return (
    <div style={{ marginTop: '5px', marginBottom: '5px' }} className="relative">
      <label style={{ color: '#555', display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>{label}</label>
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

const Card = ({ id, title, author, bg, rating, price, deposit, available, condition, status, onRentDetails }) => {
  const handleClick = () => {
    onRentDetails(id);
  }

// condition
// deposit
// image
// lat
// lng
// owner_average_rating
// price_per_day
// rent_id
// status
// title
// user
// user_name

  return (
    <div className="transition-all duration-300 hover:scale-105 hover:shadow-md"
      style={{
        width: '160px',
        minHeight: 'fit-content',
        border: '1px solid #e5e7eb',
        padding: '12px',
        background: 'white',
        borderRadius: '10px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        opacity: available === false ? 0.7 : 1
      }}
      onClick={handleClick}
    >
      {bg ? (
        <img 
          src={bg} 
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
            borderRadius: '6px',
            backgroundColor: '#f3f4f6'
          }} 
          alt={title}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : 
      <div style={{
        display: 'none',
        width: '100%',
        height: '200px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        fontSize: '12px'
      }}>
        No Image
      </div>
}
      
      <h1 style={{ 
        fontWeight: '600', 
        marginTop: '8px', 
        color: '#4b5563',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {title}
      </h1>
      
      <h2 style={{ 
        fontSize: '14px', 
        color: '#6b7280',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        Rented By: {author}
      </h2>
      
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#f59e0b', marginRight: '4px' }}>★</span>
          <span style={{ fontSize: '14px', color: '#4b5563' }}>{rating}</span>
        </div>
        
          <span style={{ 
            fontSize: '12px', 
            color: '#fff', 
            fontWeight: '500',
            backgroundColor: '#F7BA00',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {status}
          </span>
        
      </div>
      
      {(price || deposit) && (
        <div style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
          {price && <div>Price: ₹{price}</div>}
          {deposit && <div>Deposit: ₹{deposit}</div>}
          <div>------</div>
          {deposit && <div>Condition: {condition}</div>}
        </div>
      )}
    </div>
  );
}

export default RentOnlyPage