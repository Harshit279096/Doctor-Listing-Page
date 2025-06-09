import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Home';
import DoctorFinder from './Components/DoctorFinder'; // Rename your current App logic to DoctorFinder.js
import DoctorDetail from './Components/DoctorDetail';
import About from './Components/About';
import SpecialistsPage from './pages/SpecialtiesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorFinder />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
        <Route path="/" element={<SpecialistsPage />} />
        <Route path="/specialists/:specialty" element={<SpecialistsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
