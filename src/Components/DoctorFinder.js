import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorList from './DoctorList';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';
import BookingModal from './BookingModal';
import '../App.css';
import './navbar.css';

function DoctorFinder() {
  const navigate = useNavigate();
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
  const [menuOpen, setMenuOpen] = useState(false);

  // New: Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

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

  const allSpecialties = Array.from(
    new Set(doctors.flatMap(doctor => 
      doctor.specialities.map(spec => spec.name)
    ))
  ).filter(Boolean);

  const applyFilters = (currentFilters) => {
    let filtered = doctors;

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialities.some(spec => 
          spec.name.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (currentFilters.specialties.length > 0) {
      filtered = filtered.filter(doctor =>
        doctor.specialities.some(spec => 
          currentFilters.specialties.includes(spec.name)
        )
      );
    }

    if (currentFilters.consultationType === 'video') {
      filtered = filtered.filter(doctor => doctor.video_consult);
    } else if (currentFilters.consultationType === 'clinic') {
      filtered = filtered.filter(doctor => doctor.in_clinic);
    }

    if (currentFilters.sortBy === 'fees') {
      filtered.sort((a, b) => {
        const getFeeValue = (fee) => {
          if (!fee) return 0;
          const match = fee.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getFeeValue(a.fees) - getFeeValue(b.fees);
      });
    } else if (currentFilters.sortBy === 'experience') {
      filtered.sort((a, b) => {
        const getExperienceYears = (exp) => {
          if (!exp) return 0;
          const match = exp.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getExperienceYears(b.experience) - getExperienceYears(a.experience);
      });
    }

    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page whenever filters change
  };

  const handleSearchChange = (searchText) => {
    const updatedFilters = { ...filters, search: searchText };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleFilterChange = (filterType, value) => {
    let updatedFilters = { ...filters };

    if (filterType === 'specialties') {
      if (updatedFilters.specialties.includes(value)) {
        updatedFilters.specialties = updatedFilters.specialties.filter(s => s !== value);
      } else {
        updatedFilters.specialties = [...updatedFilters.specialties, value];
      }
    } else {
      updatedFilters[filterType] = value;
    }

    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Calculate the doctors to display on the current page
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Calculate total pages
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">🩺Find<span>Care</span></h1>

        {/* Hamburger Icon */}
        <div
          className={`hamburger-icon ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a onClick={() => handleNav('/')}>Home</a>
          <button onClick={() => handleNav('/doctors')} className="find-doctor-btn">
            Find Doctors
          </button>
          <a onClick={() => handleNav('/about')}>About</a>
        </div>
      </nav>

      <br />
      <br />
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
          <>
            <DoctorList 
              doctors={currentDoctors} 
              onBookAppointment={handleBookAppointment}
            />

            {/* Pagination Controls */}
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span> Page {currentPage} of {totalPages} </span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
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

export default DoctorFinder;
