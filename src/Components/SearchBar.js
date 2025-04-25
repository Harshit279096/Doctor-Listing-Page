import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ value, onChange, doctors }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside the search component
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue); // Pass the value directly as expected by App.js
    
    if (inputValue.length > 0) {
      // Find doctors matching by name
      const doctorsByName = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      // Find doctors matching by specialty
      const doctorsBySpecialty = doctors.filter(doctor => 
        doctor.specialities.some(spec => 
          spec.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
      
      // Combine and remove duplicates
      const combinedResults = [...doctorsByName];
      
      doctorsBySpecialty.forEach(doctor => {
        if (!combinedResults.some(d => d.id === doctor.id)) {
          combinedResults.push(doctor);
        }
      });
      
      // Take top results for suggestions
      setSuggestions(combinedResults.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (doctor) => {
    onChange(doctor.name); // Pass the value directly as expected by App.js
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  // Extract all unique specialties from doctors for search help text
  const allSpecialties = Array.from(
    new Set(doctors.flatMap(doctor => 
      doctor.specialities.map(spec => spec.name)
    ))
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
          placeholder={`Search by doctor name, specialty (e.g., ${allSpecialties.join(', ')})`}
          data-testid="autocomplete-input"
        />
        <i className="fas fa-search search-icon"></i>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((doctor, index) => (
              <div
                key={index}
                className="suggestion-item"
                data-testid="suggestion-item"
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
                    {doctor.specialities.map(spec => spec.name).join(', ') || 'General Physician'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="search-help">
        Try searching by doctor name or medical specialty
      </div>
    </div>
  );
};

export default SearchBar;