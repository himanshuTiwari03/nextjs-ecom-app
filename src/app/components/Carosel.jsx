import { useState } from "react";
import Image from "next/image";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    { src: "/images/slider2.jpg", alt: "Slide 1" },
    { src: "/images/slider1.jpg", alt: "Slide 2" },
    { src: "/images/slider2.jpg", alt: "Slide 3" },
  ];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel container */}
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-full h-[500px] relative">
              <Image
                src={slide.src}
                alt={slide.alt}
                layout="fill"
                objectFit="cover"
                className=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrev}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-60 p-4 rounded-full transition-all duration-300 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
      >
        &lt;
      </button>
      <button
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-60 p-4 rounded-full transition-all duration-300 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
      >
        &gt;
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full bg-white opacity-50 transition-all duration-300 ${
              currentIndex === index ? "opacity-100 bg-blue-500" : "hover:opacity-75"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
