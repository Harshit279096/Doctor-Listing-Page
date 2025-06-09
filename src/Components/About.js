import React from 'react';
import './About.css';
import './navbar.css'; // Import styles for the navbar
import doctorImage from '../Components/Screenshot 2025-05-31 192325.png';
import doctorImage1 from '../Components/Screenshot 2025-05-31 193612.png';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">🩺Find<span>Care</span></h1>
        <div className="nav-links">
          <a href="#" onClick={() => navigate('/')}>Home</a>
          <button onClick={() => navigate('/doctors')} className="find-doctor-btn">
            Find Doctors 
          </button>
          <a href="/about">About</a>
          
        </div>
      </nav>

      <section className="hero1">
        <img src={doctorImage} alt="Doctor Illustration" className="hero-img" />
        <div className="text">
          <p>
            FindCare helps you find the perfect doctor based on your symptoms, specialty, or condition.
            Book appointments with ease and get the care you deserve—all in one platform.
          </p>
        </div>
      </section>

      <section className="features1">
        <h2>Why Choose FindCare?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png" alt="Search Doctor" />
            <h3>Symptom-based Search</h3>
            <p>Easily find the right doctor by describing your symptoms.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3602/3602123.png" alt="Book Appointment" />
            <h3>Online Appointments</h3>
            <p>Book video or in-clinic consultations with just a few clicks.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2920/2920314.png" alt="Verified Doctors" />
            <h3>Verified Doctors</h3>
            <p>Consult only with experienced and certified medical professionals.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-it-works-content">
          <div className="text">
            <h2>How It Works</h2>
            <ol>
              <li>Enter your symptoms or search by specialty</li>
              <li>Browse through expert doctors</li>
              <li>Book an appointment and consult</li>
            </ol>
          </div>
          <img src={doctorImage1} alt="How It Works Illustration" className="how-img" />
        </div>
      </section>
    </div>
  );
};

export default About;
