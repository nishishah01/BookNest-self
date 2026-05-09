import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar_1.css';
import profile from '../assets/profile.svg';

const MainNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    // Map paths to menu items
    const pathToItem = {
        '/home': 'Home',
        '/discover-books': 'Explore',
        '/rent-buy': 'Rent/Buy',
        '/posts': 'Posts',
        '/fanart': 'Fanart'
    };
    
    // Set initial selected state based on current path
    const [selected, setSelected] = useState(() => {
        const currentPath = location.pathname;
        return pathToItem[currentPath] || 'Home';
    });
    
    // Update selected whenever location changes
    useEffect(() => {
        const currentPath = location.pathname;
        if (pathToItem[currentPath]) {
            setSelected(pathToItem[currentPath]);
        }
    }, [location]);

    const handleNavigation = (item) => {
        setSelected(item);
        if (item === 'Home') navigate('/home');
        else if (item === 'Explore') navigate('/discover-books');
        else if (item === 'Rent/Buy') navigate('/rent-buy');
        else if (item === 'Posts') navigate('/posts');
        else if (item === 'Fanart') navigate('/fanart');
        else if (item === 'Profile') navigate('/profilePage');
    };

    return (
        <div
            className='flex items-center justify-between px-8 py-4 bg-white shadow-md'
            style={{ position: 'relative', zIndex: 10, padding: '8px 2vw', overflow: 'visible' }}
        >
            <img
                src={logo}
                alt="Logo"
                className='mr-8'
                style={{ width: '172px', height: '69px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'right', width: '90%', gap: '50px', marginRight: '10px' }}>
                <div className='flex items-center gap-8' style={{ width: '60%', marginLeft: '100px', justifyContent: 'space-between' }}>

                    {/* Other Links */}
                    {['Home', 'Explore', 'Rent/Buy', 'Posts', 'Fanart'].map((item) => (
                        <button
                            key={item}
                            onClick={() => handleNavigation(item)}
                            className="px-4 py-2 rounded-full focus:outline-none"
                            style={{
                                color: selected === item ? 'white' : 'rgb(140, 86, 71)',
                                backgroundColor: selected === item ? 'rgba(238, 158, 136, 1)' : 'transparent',
                                padding: '1vh 1vw',
                                cursor: 'pointer'
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>

            <img onClick={() => handleNavigation("Profile")} src={profile} alt="profile image" />
            </div>
        </div>
    );
};

export default MainNavbar;