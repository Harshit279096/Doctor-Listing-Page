import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SpecialtiesPage.css';
import DoctorList from '../Components/DoctorCard';
import BookingModal from '../Components/BookingModal';

function SpecialistsPage() {
  const { specialty } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  useEffect(() => {
    const normalizedSpecialty = specialty?.toLowerCase().trim();
    const filtered = doctors.filter((doctor) =>
      doctor.specialities?.some(
        (spec) => spec?.name?.toLowerCase().trim() === normalizedSpecialty
      )
    );
    setFilteredDoctors(filtered);
  }, [specialty, doctors]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  return (
    <div className="specialists-container">
      <h2>Showing {specialty}</h2>
      {filteredDoctors.length === 0 ? (
        <p>No doctors found for {specialty}</p>
      ) : (
        <DoctorList doctors={filteredDoctors} onBookAppointment={handleBookAppointment} />
      )}

      {/* Booking Modal */}
      {showModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default SpecialistsPage;
