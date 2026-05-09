import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Spinningwheel.css";
import { useSpin } from "../context/SpinContext";

const SpinningWheel = () => {
  const { hasSpin, setHasSpin } = useSpin(); // ✅ Destructure hasSpin & setHasSpin
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);
  const spinTimeoutRef = useRef(null);

  const colors = [
    "red", "blue", "green", "yellow",
    "purple", "pink", "orange",
  ];

  const numberOfSegments = colors.length;
  const segmentAngle = 360 / numberOfSegments;

  const spinWheel = () => {
    if (isSpinning || hasSpin) return; // ✅ Prevent spin if already spun

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    setIsSpinning(true);

    const spinRotations = 2 + Math.floor(Math.random() * 3);
    const randomSegment = Math.floor(Math.random() * numberOfSegments);
    const randomAngle = randomSegment * segmentAngle;
    const newRotation = rotation + spinRotations * 360 + randomAngle + 10;

    setFinalRotation(newRotation);

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      setRotation(newRotation);
      setHasSpin(true); // ✅ Set after the spin completes
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="spinning-wheel-container">
      <div className="wheel-wrapper">
        <div className="center-point" />
        <div className="pointer">
          <div className="pointer-bar" />
        </div>

        <motion.div
          className="wheel"
          animate={{ rotate: isSpinning ? finalRotation : rotation }}
          transition={{ duration: isSpinning ? 3 : 0, ease: "easeOut" }}
        >
          {colors.map((color, index) => (
            <div
              key={index}
              className={'wheel-segment'}
              style={{
                transform: `rotate(${index * segmentAngle}deg) skewY(${90 - segmentAngle}deg)`,
                backgroundColor: `${colors[index]}`
              }}
            >
            </div>
          ))}
        </motion.div>

      </div>

      <div style={{ width: "50%" }}>
        <h2 style={{ fontFamily: 'Raleway', color: 'rgba(128, 38, 2, 1)', fontSize:'20px', fontWeight:'500' }}>Spin The Wheel for BookNest Random Pick!</h2>

        <button
          onClick={spinWheel}
          disabled={isSpinning || hasSpin} // ✅ Disable if already spun
          className="spin-button"
        >
          {isSpinning ? "Spinning..." : hasSpin ? "Already Spun" : "Spin the Wheel!"}
        </button>

        <h3 style={{ marginTop: '2vh', fontFamily: 'Lora' }}>You will get only 1 chance per day</h3>
      </div>
    </div>
  );
};

export default SpinningWheel;
