import { useState } from 'react';
import IntroNavbar_1 from '../components/IntroNavbar_1';
import search from "../assets/search.svg";
import Footer from "../components/Footer";

const DiscoverPeoplePage = () => {
    const [users] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            username: "@sarahj",
            age: 28,
            location: "San Francisco, CA",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 2,
            name: "Miguel Rodriguez",
            username: "@miguelr",
            age: 34,
            location: "Austin, TX",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 3,
            name: "Aisha Patel",
            username: "@aishap",
            age: 26,
            location: "Chicago, IL",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 4,
            name: "David Kim",
            username: "@davidk",
            age: 31,
            location: "Seattle, WA",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 5,
            name: "Olivia Chen",
            username: "@oliviac",
            age: 29,
            location: "New York, NY",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 6,
            name: "Olivia Chen",
            username: "@oliviac",
            age: 29,
            location: "New York, NY",
            profileImage: "/api/placeholder/80/80"
        },
        
        {
            id: 2,
            name: "Miguel Rodriguez",
            username: "@miguelr",
            age: 34,
            location: "Austin, TX",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 3,
            name: "Aisha Patel",
            username: "@aishap",
            age: 26,
            location: "Chicago, IL",
            profileImage: "/api/placeholder/80/80"
        },
        {
            id: 4,
            name: "David Kim",
            username: "@davidk",
            age: 31,
            location: "Seattle, WA",
            profileImage: "/api/placeholder/80/80"
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerStyle = {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        boxSizing: 'border-box'
    };

    const userCardStyle = {
        width: '30%',
        minWidth: '250px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        margin: '10px',
        background: 'linear-gradient(90deg, rgb(253, 173, 130), rgb(253, 244, 240))',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    };

    const profileImageStyle = {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #e5e7eb',
        flexShrink: 0
    };

    const userInfoStyle = {
        marginLeft: '16px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const userHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const nameStyle = {
        fontWeight: '600',
        fontSize: '18px',
        color: '#333',
        margin: 0
    };

    const usernameStyle = {
        color: '#3b82f6',
        margin: '4px 0'
    };

    const connectButtonStyle = {
        backgroundColor: '#FFAA92',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    };

    const userDetailsStyle = {
        display: 'flex',
        marginTop: '4px',
        fontSize: '14px',
        color: '#666'
    };

    const ageStyle = {
        marginRight: '16px'
    };

    const noResultsStyle = {
        textAlign: 'center',
        padding: '32px 0',
        color: '#6b7280'
    };

    const headerStyle = {
        textAlign: 'center',
        margin: '30px 0'
    };

    const titleStyle = {
        color: '#8b4513',
        fontSize: '30px',
        fontFamily: 'Raleway',
        fontWeight: '600',
        margin: 0
    };

    const subtitleStyle = {
        color: '#b08068',
        fontSize: '18px',
        marginTop: '8px'
    };

    const searchInputWrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#f9f9f9'
    };

    const inputStyle = {
        flex: 1,
        fontSize: '16px',
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
        marginLeft: '10px'
    };

    return (
        <div className='discover-books-page'>
            <IntroNavbar_1 />

            <div className='header'>
                <h1 style={titleStyle}>Discover People</h1>
                <p style={subtitleStyle}>Connect and grow — discover amazing people and their stories!</p>
                <div className='search-input'>
                    <img src={search} alt="Search icon" width={20} />
                    <input
                        type="text"
                        placeholder="Search by name, username or location..."
                        style={inputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={containerStyle}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <div
                            key={user.id}
                            style={userCardStyle}
                        >
                            <img
                                src={user.profileImage}
                                alt={`${user.name}'s profile`}
                                style={profileImageStyle}
                            />
                            <div style={userInfoStyle}>
                                <div style={userHeaderStyle}>
                                    <div>
                                        <h3 style={nameStyle}>{user.name}</h3>
                                        <p style={usernameStyle}>{user.username}</p>
                                    </div>
                                    <button
                                        style={connectButtonStyle}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFAA92'}
                                    >
                                        Connect
                                    </button>
                                </div>
                                <div style={userDetailsStyle}>
                                    <span style={ageStyle}>{user.age} years old</span>
                                    <span>{user.location}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={noResultsStyle}>
                        No users found matching your search.
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default DiscoverPeoplePage;
