import React from 'react';

const DoctorList = ({ doctors, onBookAppointment }) => {
  return (
    <div className="doctor-list">
      {doctors.length === 0 ? (
        <div className="no-doctors">No doctors found matching your criteria.</div>
      ) : (
        doctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-header">
              <img 
                src={doctor.photo} 
                alt={doctor.name} 
                className="doctor-photo"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="doctor-basic-info">
                <h3 className="doctor-name">{doctor.name}</h3>
                <div className="doctor-specialties">
                  {doctor.specialities.map((spec, index) => (
                    <span key={index} className="specialty-tag">{spec.name}</span>
                  ))}
                </div>
                <div className="doctor-experience">{doctor.experience}</div>
              </div>
            </div>
            
            {doctor.doctor_introduction && (
              <div className="doctor-intro">{doctor.doctor_introduction}</div>
            )}
            
            <div className="doctor-details">
              <div className="consultation-fee">
                <span className="fee-label">Consultation Fee:</span>
                <span className="fee-amount">{doctor.fees}</span>
              </div>
              
              <div className="consultation-modes">
                {doctor.video_consult && (
                  <span className="mode-tag video-consult">Video Consultation</span>
                )}
                {doctor.in_clinic && (
                  <span className="mode-tag in-clinic">In-Clinic Consultation</span>
                )}
              </div>
            </div>
            
            {doctor.clinic && (
              <div className="clinic-info">
                <div className="clinic-name">{doctor.clinic.name}</div>
                <div className="clinic-address">
                  {doctor.clinic.address?.address_line1 && (
                    <div>{doctor.clinic.address.address_line1}</div>
                  )}
                  <div>
                    {doctor.clinic.address?.locality && `${doctor.clinic.address.locality}, `}
                    {doctor.clinic.address?.city}
                  </div>
                </div>
              </div>
            )}
            
            {doctor.languages && doctor.languages.length > 0 && (
              <div className="languages">
                <span className="languages-label">Languages:</span>
                <div className="language-tags">
                  {doctor.languages.map((lang, index) => (
                    <span key={index} className="language-tag">{lang}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Book Appointment button */}
            <div className="doctor-actions">
              <button 
                className="book-button"
                onClick={() => onBookAppointment(doctor)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorList;