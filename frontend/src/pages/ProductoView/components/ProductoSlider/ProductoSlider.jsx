// PropertySlider.jsx
import { useState } from "react";
import "./PropertySlider.css";
import { API_URL } from "../../../../shared/services/http.services";

export default function ProductoSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);

  const goTo = (n) => setCurrent((n + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div className="ps">

      <div className="ps-main">
        <div className="ps-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((img, i) => (
            <div className="ps-slide" key={i}>
              <img src={`${API_URL}${img.url}`} alt={`Imagen ${i + 1}`} />
            </div>
          ))}
        </div>
        
        {
          images.length > 1 && (
          <>
            <button className="ps-arrow prev" onClick={() => goTo(current - 1)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9l5 5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="ps-arrow next" onClick={() => goTo(current + 1)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>)
      
        }
        </div>
        
      
      {}
      <div className="ps-thumbs">
        {images.map((img, i) => (
          <div
            key={i}
            className={`ps-thumb ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          >
            <img src={`${API_URL}${img.url}`} alt={`Miniatura ${i + 1}`} />
          </div>
        ))}
      </div>

    </div>
  );
}