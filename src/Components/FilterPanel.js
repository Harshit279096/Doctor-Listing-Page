import React from 'react';

const FilterPanel = ({ filters, onFilterChange, specialties }) => {
  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 className="filter-header">Consultation Mode</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="consultationMode"
              checked={filters.consultationType === 'all'}
              onChange={() => onFilterChange('consultationType', 'all')}
            />
            All
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="consultationMode"
              checked={filters.consultationType === 'video'}
              onChange={() => onFilterChange('consultationType', 'video')}
            />
            Video Consultation
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="consultationMode"
              checked={filters.consultationType === 'clinic'}
              onChange={() => onFilterChange('consultationType', 'clinic')}
            />
            In-Clinic Consultation
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-header">Specialties</h3>
        <div className="filter-options specialty-options">
          {specialties.length === 0 ? (
            <div className="loading-specialties">Loading specialties...</div>
          ) : (
            specialties.map(specialty => (
              <label key={specialty} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.specialties.includes(specialty)}
                  onChange={() => onFilterChange('specialties', specialty)}
                />
                {specialty}
              </label>
            ))
          )}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-header">Sort By</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'fees'}
              onChange={() => onFilterChange('sortBy', 'fees')}
            />
            Fees (Low to High)
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'experience'}
              onChange={() => onFilterChange('sortBy', 'experience')}
            />
            Experience (High to Low)
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;