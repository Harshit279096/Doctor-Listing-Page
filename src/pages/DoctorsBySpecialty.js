import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoctorCard from '../Components/DoctorCard';
import '../Components/DoctorCard.css'; // Adjust the path as necessary

const DoctorsBySpecialty = () => {
  const { name } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((doc) =>
          doc.speciality?.toLowerCase().includes(name.toLowerCase())
        );
        setDoctors(filtered);
        setLoading(false);
      });
  }, [name]);

  return (
    <div className="doctors-page">
      <h2>{name} Specialists</h2>
      {loading ? <p>Loading...</p> : (
        doctors.length ? (
          <div className="doctor-list">
            {doctors.map((doc, index) => (
              <DoctorCard key={index} doctor={doc} />
            ))}
          </div>
        ) : (
          <p>No doctors found for this specialty.</p>
        )
      )}
    </div>
  );
};

export default DoctorsBySpecialty;
