import React, { useState, useEffect } from "react";
import "../style/slider.css"; // Import your slider styles

const Slider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment index to show the next image
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [images.length]);

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <div
          key={index}
          className={`slider-image ${index === activeIndex ? "active" : ""}`}
          style={{
            backgroundImage: `url(${image})`,
            transition: "opacity 1s ease-in-out", // Adjust transition duration here
            opacity: index === activeIndex ? 1 : 0,
          }}
        >
          <div className="text-overlay">
            <h1>Court Information Management System</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
