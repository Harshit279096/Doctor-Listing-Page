import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Chatbot from './Chatbot';

function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 Hamburger state

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error('Error fetching doctors:', error));
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div>
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

      {/* Hero Section */}
      <section className="hero">
        <h2>Your Home for Health</h2>
        <p>Find and book doctors, clinics, hospitals, and more.</p>
        <SearchBar 
          value={searchValue} 
          onChange={setSearchValue} 
          doctors={doctors} 
        />
      </section>

      {/* Specialties */}
      <section className="specialties">
        <h3>Browse by Specialties</h3>
        <div className="specialty-list">
          {[
            'General Physician',
            'Gynaecologist and Obstetrician',
            'Ayurveda',
            'Ophthalmologist',
            'Homeopath',
            'Dentist'
          ].map((specialty) => (
            <button key={specialty} onClick={() => navigate(`/specialists/${specialty.toLowerCase()}`)}>
              {specialty}
            </button>
          ))}
        </div>
      </section>

      {doctors.length > 0 && <Chatbot doctors={doctors} />}
    </div>
  );
}

export default HomePage;
