import React from 'react';
import './DoctorDetailedCard.css'; // Style as per image 2

function DoctorDetailCard({ doctor }) {
  return (
    <div className="doctor-detail-card">
      <img src={doctor.image} alt={doctor.name} className="doctor-img" />
      <div className="doctor-info">
        <h2>{doctor.name}</h2>
        <span className="specialty-tag">{doctor.speciality}</span>
        <p>{doctor.experience} Years of experience</p>
        <p>{doctor.description}</p>
        <p>Consultation Fee: ₹ {doctor.fee}</p>

        <h4>{doctor.clinicName}</h4>
        <p>{doctor.address}</p>

        <div className="languages">
          <strong>Languages: </strong>
          {doctor.languages?.map((lang, i) => (
            <span key={i} className="lang-pill">{lang}</span>
          ))}
        </div>

        <div className="consult-type">
          {doctor.video && <span className="video-consult">Video Consultation</span>}
          {doctor.inclinic && <span className="inclinic-consult">In-Clinic Consultation</span>}
        </div>

        <button className="book-btn">Book Appointment</button>
      </div>
    </div>
  );
}

export default DoctorDetailCard;
