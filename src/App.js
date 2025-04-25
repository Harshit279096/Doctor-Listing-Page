import React, { useState, useEffect } from 'react';
import DoctorList from './Components/DoctorList';
import FilterPanel from './Components/FilterPanel';
import SearchBar from './Components/SearchBar';
import BookingModal from './Components/BookingModal';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    consultationType: 'all',
    specialties: [],
    sortBy: ''
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        const data = await response.json();

        const normalizedDoctors = data.map(doctor => ({
          ...doctor,
          specialities: doctor.specialities || [],
          video_consult: doctor.video_consult || false,
          in_clinic: doctor.in_clinic || false
        }));

        setDoctors(normalizedDoctors);
        setFilteredDoctors(normalizedDoctors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Extract all unique specialties
  const allSpecialties = Array.from(
    new Set(doctors.flatMap(doctor => 
      doctor.specialities.map(spec => spec.name)
    ))
  ).filter(Boolean);

  const applyFilters = (currentFilters) => {
    let filtered = doctors;
  
    // Search filter - improved to search by name or specialty
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(doctor =>
        // Search by doctor name
        doctor.name.toLowerCase().includes(searchTerm) ||
        // Search by specialty
        doctor.specialities.some(spec => 
          spec.name.toLowerCase().includes(searchTerm)
        )
      );
    }
  
    // Specialties filter
    if (currentFilters.specialties.length > 0) {
      filtered = filtered.filter(doctor =>
        doctor.specialities.some(spec => 
          currentFilters.specialties.includes(spec.name)
        )
      );
    }
  
    // Consultation type
    if (currentFilters.consultationType === 'video') {
      filtered = filtered.filter(doctor => doctor.video_consult);
    } else if (currentFilters.consultationType === 'clinic') {
      filtered = filtered.filter(doctor => doctor.in_clinic);
    }
  
    // Sorting
    if (currentFilters.sortBy === 'fees') {
      filtered.sort((a, b) => {
        // Extract numeric value from fees string
        const getFeeValue = (fee) => {
          if (!fee) return 0;
          const match = fee.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getFeeValue(a.fees) - getFeeValue(b.fees);
      });
    } else if (currentFilters.sortBy === 'experience') {
      filtered.sort((a, b) => {
        // Extract years from experience string
        const getExperienceYears = (exp) => {
          if (!exp) return 0;
          const match = exp.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getExperienceYears(b.experience) - getExperienceYears(a.experience);
      });
    }
  
    setFilteredDoctors(filtered);
  };

  // Direct search change handler that accepts a string value
  const handleSearchChange = (searchText) => {
    const updatedFilters = { ...filters, search: searchText };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  // Filter change handler for specialty, consultation type, and sort options
  const handleFilterChange = (filterType, value) => {
    let updatedFilters = { ...filters };
    
    if (filterType === 'specialties') {
      // Toggle specialty selection
      if (updatedFilters.specialties.includes(value)) {
        updatedFilters.specialties = updatedFilters.specialties.filter(s => s !== value);
      } else {
        updatedFilters.specialties = [...updatedFilters.specialties, value];
      }
    } else {
      // For radio button filters (consultationType, sortBy)
      updatedFilters[filterType] = value;
    }
    
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Find Your Perfect Doctor</h1>
        <SearchBar 
          value={filters.search}
          onChange={handleSearchChange}
          doctors={doctors}
        />
      </header>

      <div className="container">
        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          specialties={allSpecialties}
        />

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <DoctorList 
            doctors={filteredDoctors} 
            onBookAppointment={handleBookAppointment}
          />
        )}
      </div>

      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}

export default App;