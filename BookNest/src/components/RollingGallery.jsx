import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import "../styles/RollingGallery.css";
import poster_1 from "../spinwheel_posters/img1.png";
import poster_2 from "../spinwheel_posters/img2.png";
import poster_3 from "../spinwheel_posters/img3.png";
import poster_4 from "../spinwheel_posters/img4.png";
import poster_5 from "../spinwheel_posters/img5.png";
import revealed_poster from "../book_posters/poster_1.png";
import logo from "../assets/logo.png";

const revealed_book = [revealed_poster];
const IMGS = [poster_1, poster_2, poster_3, poster_4, poster_5, poster_3, poster_4, poster_1, poster_3];

const RollingGallery = ({ images = [] }) => {
    images = IMGS;
    const [isScreenSizeSm, setIsScreenSizeSm] = useState(window.innerWidth <= 640);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showRevealedPoster, setShowRevealedPoster] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const cylinderWidth = isScreenSizeSm ? 1100 : 1800;
    const faceCount = images.length;
    const faceWidth = (cylinderWidth / faceCount) * 1.5; // Increased width for items
    const radius = cylinderWidth / (2 * Math.PI);

    const rotation = useMotionValue(0);
    const controls = useAnimation();

    // Handle spin functionality
    const handleSpin = () => {
        if (isSpinning) return;
    
        setIsSpinning(true);
        setShowRevealedPoster(false); // Hide revealed poster during spin
    
        const fullRotations = 2 + Math.floor(Math.random() * 3); // 2-4 full spins
        const randomIndex = Math.floor(Math.random() * faceCount);
        const anglePerFace = 360 / faceCount;
        const targetAngle = randomIndex * anglePerFace;
    
        const currentRotation = rotation.get() % 360;
        const desiredRotation = (fullRotations * 360) + (targetAngle - currentRotation);
    
        controls.start({
            rotateY: rotation.get() - desiredRotation,
            transition: {
                duration: 3 + fullRotations,
                ease: [0.34, 1.56, 0.64, 1], // Smooth overshoot
            }
        }).then(() => {
            rotation.set(rotation.get() - desiredRotation);
            setIsSpinning(false);
            setSelectedBook(images[randomIndex]);
            
            // Show revealed poster after a short delay
            setTimeout(() => {
                setShowRevealedPoster(true);
            }, 500);
            
            // Optional: log or display the selected book
            console.log("Selected Book:", images[randomIndex]);
        });
    };    

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSizeSm(window.innerWidth <= 640);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Revealed Poster Modal */}
            {showRevealedPoster && (
                <>
                    {/* Overlay */}
                    <div 
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 1000,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            paddingTop: '20px'
                        }}
                    />
                    
                    {/* Revealed Poster Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1001,
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0px 20px 40px rgba(128, 38, 2, 0.3)',
                            border: '4px solid rgba(128, 38, 2, 0.2)',
                            textAlign: 'center',
                            maxWidth: '90vw',
                            height:'90vh'
                        }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{
                                fontFamily: 'Raleway',
                                fontSize: '16px',
                                color: 'rgba(128, 38, 2, 0.8)',
                                marginBottom: '20px'
                            }}>
                                You've revealed this amazing book!
                            </p>
                        </div>
                        
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img 
                                src={revealed_poster} 
                                alt="Revealed Book" 
                                style={{
                                    width: '200px',
                                    height: '300px',
                                    borderRadius: '12px',
                                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                backgroundColor: '#ff4757',
                                color: 'white',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                animation: 'pulse 2s infinite'
                            }}>
                                ✨
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowRevealedPoster(false)}
                            style={{
                                marginTop: '20px',
                                padding: '12px 30px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                backgroundColor: 'rgba(128, 38, 2, 1)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = 'rgba(128, 38, 2, 0.8)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'rgba(128, 38, 2, 1)';
                                e.target.style.transform = 'translateY(0px)';
                            }}
                        >
                            Close
                        </button>
                    </motion.div>
                </>
            )}

            <div className="gallery-container">
                <div className="gallery-gradient gallery-gradient-left"></div>
                <div className="gallery-gradient gallery-gradient-right"></div>
                <div className="gallery-content">
                    <div>
                        <h1 style={{ fontFamily: 'Raleway', color: 'rgba(128, 38, 2, 1)', fontSize: '25px', textAlign: 'left', fontWeight:'600' }}>Spin The Wheel
                            for a random pick!
                        </h1>
                        <div className="spin-button-container" style={{ paddingTop: "10px", background: 'transparent' }}>

                            <button
                                onClick={handleSpin}
                                disabled={isSpinning}
                                className="spin-button"
                                style={{
                                    padding: "12px 24px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    backgroundColor: isSpinning ? "#cccccc" : "#fff",
                                    color: "black",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: isSpinning ? "not-allowed" : "pointer",
                                    transition: "background-color 0.3s",
                                    marginBottom: '5vh',
                                    boxShadow: '0px 0px 10px rgba(128, 38, 2, 1)'
                                }}
                            >
                                {isSpinning ? "Spinning..." : "Spin Gallery"}
                            </button>
                        </div>

                        {/* <img src={logo} style={{ width: '200px' }} /> */}

                    </div>
                    <motion.div
                        className="gallery-track"
                        style={{
                            rotateY: rotation,
                            width: cylinderWidth,
                            transformStyle: "preserve-3d",
                            pointerEvents: isSpinning ? "none" : "auto" // Disable interaction during spin
                        }}
                        animate={controls}
                    >
                        {images.map((url, i) => (
                            <div
                                key={i}
                                className="gallery-item"
                                style={{
                                    width: `${faceWidth}px`,
                                    transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                                }}
                            >
                                <img src={url} alt="gallery" className="gallery-img" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </>
    );
};

export default RollingGallery;