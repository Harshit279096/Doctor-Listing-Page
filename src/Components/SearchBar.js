import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


const SearchBar = ({ value, onChange, doctors }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const inputValue = value.trim().toLowerCase();

    if (inputValue.length > 0) {
      // Match by name
      const byName = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(inputValue)
      );

      // Match by specialty (exact case-insensitive match)
      const bySpecialty = doctors.filter((doc) =>
        (doc.specialities || []).some((spec) =>
          spec.name.toLowerCase() === inputValue
        )
      );

      // Combine unique results
      const combined = [...byName];
      bySpecialty.forEach((doc) => {
        if (!combined.find((d) => d.id === doc.id)) {
          combined.push(doc);
        }
      });

      setSuggestions(combined.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, doctors]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (doctor) => {
    setShowSuggestions(false);
    navigate(`/doctor/${doctor.id}`); // ✅ Redirect to doctor page
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  const allSpecialties = Array.from(
    new Set(
      doctors.flatMap((doctor) =>
        (doctor.specialities || []).map((spec) => spec.name)
      )
    )
  ).filter(Boolean).slice(0, 3);

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          placeholder={`Search by name or specialty (e.g., ${allSpecialties.join(', ')})`}
        />
        <i className="fas fa-search search-icon"></i>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((doctor) => (
              <div
                key={doctor.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(doctor)}
              >
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="suggestion-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/50';
                  }}
                />
                <div className="suggestion-info">
                  <div className="suggestion-name">{doctor.name}</div>
                  <div className="suggestion-specialty">
                    {(doctor.specialities || [])
                      .map((spec) => spec.name)
                      .join(', ') || 'General Physician'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showSuggestions && suggestions.length === 0 && (
          <div className="no-results">No doctor found</div>
        )}
      </div>
      <div className="search-help">
        Try searching by doctor name or medical specialty
      </div>
    </div>
  );
};

export default SearchBar;
