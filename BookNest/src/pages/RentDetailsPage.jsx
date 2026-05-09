import Cookies from "js-cookie";
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rents } from '../apis/rent.api';
import poster_1 from "../book_posters/poster_15.png";
import Footer from '../components/Footer';
import MainNavbar from '../components/MainNavbar';

const RentDetailsPage = () => {
    const navigate = useNavigate();
    const { rentId } = useParams(); // Get rent ID from URL params
    
    const [rentBookData, setRentBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch rental details
    useEffect(() => {
        const fetchRentalDetails = async () => {
            if (!rentId) {
                setError('No rental ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
    try {
                const token = Cookies.get('token');
                if (!token) {
                    throw new Error('Authentication token not found. Please login again.');
                }

                const response = await fetch(`${rents}/${rentId}`, {
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
                        throw new Error('Rental not found.');
                    } else if (response.status >= 500) {
                        throw new Error('Server error. Please try again later.');
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                const data = await response.json();
                console.log('Fetched rental details:', data);
                
//api
                const transformedData = {
                    // From rent_data
                    title: data.rent_data?.title || 'Unknown Title',
                    price_per_day: data.rent_data?.price_per_day || '150',
                    status: data.rent_data?.status || 'Available',
                    condition: data.rent_data?.condition || 'Good',
                    deposit: data.rent_data?.deposit || '200',
                    image: data.rent_data?.image,
                    owner_average_rating: data.rent_data?.owner_average_rating || '3',
                    lat: data.rent_data?.lat,
                    lng: data.rent_data?.lng,
                    
                    // From owner_data
                    user_name: data.owner_data?.username || 'Unknown Owner',
                    contact: data.owner_data?.contact || '+91 XXXXXXXXXX',
                    owner_rating: data.owner_data?.average_rating || '3',
                    
                    // Additional fields
                    author: data.rent_data?.user_name || data.owner_data?.username || 'Unknown Author',
                    location: data.rent_data?.lat && data.rent_data?.lng ? 
                        `Lat: ${data.rent_data.lat}, Lng: ${data.rent_data.lng}` : 
                        'Location not specified',
                    description: data.rent_data?.title ? 
                        `"${data.rent_data.title}" - ${data.rent_data.condition || 'Condition not specified'}` : 
                        'No description available',
                    
                    // Store original data for debugging
                    _originalData: data
                };
                
                setRentBookData(transformedData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching rental details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRentalDetails();
    }, [rentId]);

    const handleGoBack = () => {
        navigate('/rent-buy');
    }

    const handleRetry = () => {
        setError(null);
        // Re-fetch data by triggering useEffect
        setLoading(true);
    };

    // Loading state
    if (loading) {
        return (
            <div>
                <MainNavbar />
                <div className="bg-white text-gray-800" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <button className="text-red-700 flex items-center cursor-pointer" onClick={handleGoBack}>
                            <ChevronLeft size={20} />
                            Go Back
                        </button>
                    </div>
                    <div className="text-center" style={{ padding: '60px 20px' }}>
                        <div style={{
                            border: '4px solid #f3f4f6',
                            borderTop: '4px solid #f59e0b',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }}></div>
                        <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading rental details...</p>
                    </div>
                </div>
                <Footer />
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <MainNavbar />
                <div className="bg-white text-gray-800" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <button className="text-red-700 flex items-center cursor-pointer" onClick={handleGoBack}>
                            <ChevronLeft size={20} />
                            Go Back
                        </button>
                    </div>
                    <div className="text-center" style={{ padding: '60px 20px' }}>
                        <div style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '20px',
                            borderRadius: '8px',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            <h2 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Error Loading Rental</h2>
                            <p style={{ marginBottom: '15px' }}>{error}</p>
                            <button
                                onClick={handleRetry}
                                style={{
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                Retry
                            </button>
                            <button
                                onClick={handleGoBack}
                                style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // If no data found
    if (!rentBookData) {
        return (
            <div>
                <MainNavbar />
                <div className="bg-white text-gray-800" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <button className="text-red-700 flex items-center cursor-pointer" onClick={handleGoBack}>
                            <ChevronLeft size={20} />
                            Go Back
                        </button>
                    </div>
                    <div className="text-center" style={{ padding: '60px 20px' }}>
                        <p style={{ color: '#6b7280', fontSize: '18px' }}>No rental details found</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <MainNavbar />

            <div className="bg-white text-gray-800" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                
                <div style={{ marginBottom: '20px' }}>
                    <button className="text-red-700 flex items-center cursor-pointer" onClick={handleGoBack}>
                        <ChevronLeft size={20} />
                        Go Back
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row" style={{ gap: '30px' }}>
                    
                    <div style={{ flex: '0 0 330px' }}>
                        <div className="relative">
                            {rentBookData.image ? (
                                <img
                                    src={rentBookData.image}
                                    alt={rentBookData.title || "Book Cover"}
                                    className="w-full"
                                    style={{ borderRadius: '8px', height: '400px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = poster_1; //defaultt
                                    }}
                                />
                            ) : (
                                <img
                                    src={poster_1}
                                    alt="Default Book Cover"
                                    className="w-full"
                                    style={{ borderRadius: '8px', height: '400px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="flex justify-center" style={{ marginTop: '15px' }}>
                                <span className="h-2 w-2 rounded-full bg-gray-500 mx-1"></span>
                                <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
                                <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
                            </div>
                        </div>
                    </div>

                    
                    <div style={{ flex: '1', paddingTop: '10px' }}>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <span 
                                style={{padding:'1vh 1vw'}} 
                                className={`text-white rounded-full px-4 py-1 text-sm ${
                                    rentBookData.status === 'available' ? 'bg-green-500' : 
                                    rentBookData.status === 'rented' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}
                            >
                                {rentBookData.status === 'available' ? 'Available' : 
                                 rentBookData.status === 'rented' ? 'Rented' : 
                                 rentBookData.status || 'Unknown'}
                            </span>
                        </div>

                        {/* Book Title and Authors */}
                        <h1 className="text-4xl font-semibold text-amber-900" style={{ marginBottom: '10px', fontFamily:'Raleway' }}>
                            {rentBookData.title}
                        </h1>
                        <h2 className="text-xl text-amber-900" style={{ marginBottom: '20px' }}>
                            {rentBookData.author}
                        </h2>

                        {/* Price */}
                        <div className="flex items-center" style={{ marginBottom: '30px' }}>
                            <span className="text-3xl font-semibold text-amber-900">
                                ₹{rentBookData.price_per_day}/-
                            </span>
                            <span className="text-sm text-red-400" style={{ marginLeft: '10px' }}>
                                (Per Day)
                            </span>
                        </div>

                        {/* Book Info Box */}
                        <div style={{ padding: '15px', marginBottom: '20px', border:'2px solid gray', borderRadius:'10px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <span className="text-gray-600">Book Owner: </span>
                                <span className="text-gray-800">
                                    {rentBookData.user_name}
                                </span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span className="text-gray-600">Owner Rating: </span>
                                <span className="text-gray-800">
                                    {rentBookData.owner_rating} 
                                    <span className="text-yellow-500"> ★</span>
                                </span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span className="text-gray-600">Book Rating: </span>
                                <span className="text-gray-800">
                                    {rentBookData.owner_average_rating} 
                                    <span className="text-yellow-500"> ★</span>
                                </span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span className="text-gray-600">Location: </span>
                                <span className="text-gray-800">
                                    {rentBookData.location}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Contact: </span>
                                <span className="text-gray-800">
                                    {rentBookData.contact}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex" style={{ gap: '10px', marginBottom: '20px' }}>
                            <div className="flex-1">
                                <button className="w-full text-left text-gray-700 flex items-center justify-between" style={{ padding: '8px 15px', border:'2px solid gray', borderRadius:'10px' }}>
                                    <span>Book Condition: {rentBookData.condition}</span>
                                    <ChevronLeft size={16} className="transform rotate-270" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <button className="w-full text-left text-gray-700 flex items-center justify-between" style={{ padding: '8px 15px', marginBottom: '5px', border:'2px solid gray', borderRadius:'10px' }}>
                                <span>Duration Of Rent</span>
                                <ChevronLeft size={16} className="transform rotate-270" />
                            </button>
                            <p className="text-xs text-gray-500" style={{ marginLeft: '5px' }}>*Can be discussed with Owner</p>
                        </div>
                    </div>

                    {/* Right Side Content */}
                    <div style={{ flex: '0 0 280px' }}>
                        {/* Description Box */}
                        <div className="text-sm" style={{ padding: '15px', marginBottom: '20px', border:'1px solid brown', color:'brown', borderRadius:'10px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Book Title:</strong> {rentBookData.title}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Condition:</strong> {rentBookData.condition}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Rent ID:</strong> {rentBookData._originalData?.rent_data?.rent_id}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>User ID:</strong> {rentBookData._originalData?.rent_data?.user}
                            </div>
                            {rentBookData.lat && rentBookData.lng && (
                                <div>
                                    <strong>Coordinates:</strong> {rentBookData.lat}, {rentBookData.lng}
                                </div>
                            )}
                        </div>

                        {/* Deposit Amount Box */}
                        <div className="rounded-md" style={{ padding: '15px', border:'1px solid brown' }}>
                            <div className="text-gray-700" style={{ marginBottom: '10px', color:'brown', textAlign:'center'}}>
                                Deposit Amount:
                            </div>
                            <div className="text-3xl font-semibold text-amber-900 text-center">
                                ₹{rentBookData.deposit}/-
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <Footer />
        </div>
    );
}

export default RentDetailsPage;