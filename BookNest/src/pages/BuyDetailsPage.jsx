import React, { useState } from 'react';
import { ChevronLeft, Phone, Layers } from 'lucide-react';
import poster_1 from "../book_posters/poster_15.png";
import MainNavbar from '../components/MainNavbar';
import RentBookReviews from '../components/RentBookReviews';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const BuyDetailsPage = () => {

    const navigate = useNavigate();

    const BuyBookData = useState({});

    const handleGoBack = () => {
        navigate('/rent-buy');
    }

    return (
        <div>
            <MainNavbar />

            <div className="bg-white text-gray-800" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Back Button */}
                <div style={{ marginBottom: '20px' }}>
                    <button className="text-red-700 flex items-center cursor-pointer" onClick={handleGoBack}>
                        <ChevronLeft size={20} />
                        Go Back
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row" style={{ gap: '30px' }}>
                    {/* Book Image Section */}
                    <div style={{ flex: '0 0 330px' }}>
                        <div className="relative">
                            <img
                                src={poster_1}
                                alt="Let's Make Ramen! Cookbook"
                                className="w-full"
                                style={{ borderRadius: '8px' }}
                            />
                            <div className="flex justify-center" style={{ marginTop: '15px' }}>
                                <span className="h-2 w-2 rounded-full bg-gray-500 mx-1"></span>
                                <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
                                <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
                            </div>
                        </div>
                    </div>

                    {/* Book Details Section */}
                    <div style={{ flex: '1', paddingTop: '10px' }}>
                        {/* Availability Badge */}
                        <div style={{ marginBottom: '15px' }}>
                            <span style={{padding:'1vh 1vw'}} className="bg-green-500 text-white rounded-full px-4 py-1 text-sm">
                                Available
                            </span>
                        </div>

                        {/* Book Title and Authors */}
                        <h1 className="text-4xl font-semibold text-amber-900" style={{ marginBottom: '10px', fontFamily:'Raleway' }}>
                            Let's Make Ramen!
                        </h1>
                        <h2 className="text-xl text-amber-900" style={{ marginBottom: '20px' }}>
                            Hugh Amano & Sarah Becan
                        </h2>

                        {/* Price */}
                        <div className="flex items-center" style={{ marginBottom: '30px' }}>
                            <span className="text-3xl font-semibold text-amber-900">150/-</span>
                        </div>

                        {/* Book Info Box */}
                        <div className="border border-gray-300 rounded-md" style={{ padding: '15px', marginBottom: '20px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <span className="text-gray-600">Book Owner: </span>
                                <span className="text-gray-800">SassyStud123</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span className="text-gray-600">BookNest Rating: </span>
                                <span className="text-gray-800">3.8 <span className="text-yellow-500">★</span></span>
                            </div>
                            <div>
                                <span className="text-gray-600">Contact: </span>
                                <span className="text-gray-800">+91 XXXXXXXXXX</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex" style={{ gap: '10px', marginBottom: '20px' }}>
                            <div className="flex-1">
                                <button className="border border-gray-300 rounded-md w-full text-left text-gray-700 flex items-center justify-between" style={{ padding: '8px 15px' }}>
                                    <span>Book Condition</span>
                                    <ChevronLeft size={16} className="transform rotate-270" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Content */}
                    <div style={{ flex: '0 0 280px' }}>
                        {/* Lorem Ipsum Box */}
                        <div className="border rounded-md text-sm" style={{ padding: '15px', marginBottom: '20px', border:'1px solid brown', color:'brown' }}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </div>
                    </div>
                </div>
            </div>
            <RentBookReviews />
            <Footer />
        </div>
    );
}

export default BuyDetailsPage;