import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [suggestedDoctor, setSuggestedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const foundDoctor = data.find((doc) => String(doc.id) === String(id));
        if (!foundDoctor) throw new Error('Doctor not found');

        setDoctor(foundDoctor);

        const sameSpeciality = foundDoctor.specialities?.[0]?.name || '';
        const suggestions = data.filter(
          (doc) => doc.id !== foundDoctor.id && doc.specialities?.some(s => s.name === sameSpeciality)
        );

        setSuggestedDoctor(suggestions[0] || null);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <div>Loading doctor information...</div>;
  if (error) return <div>Error loading doctor information: {error}</div>;
  if (!doctor) return <div>No doctor data available.</div>;

  const renderDoctorCard = (doc, isSuggested = false) => (
    <div
      className="doctor-detail doctor-card"
      style={{ cursor: isSuggested ? 'pointer' : 'default' }}
      onClick={() => isSuggested && navigate(`/doctor/${doc.id}`)}
    >
      <div className="doctor-header">
        <img
          src={doc.photo}
          alt={doc.name}
          className="doctor-photo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
        <div className="doctor-basic-info">
          <h3 className="doctor-name">{doc.name}</h3>
          <div className="doctor-specialties">
            {doc.specialities.map((spec, index) => (
              <span key={index} className="specialty-tag">{spec.name}</span>
            ))}
          </div>
          <div className="doctor-experience">{doc.experience}</div>
        </div>
      </div>

      {doc.doctor_introduction && (
        <div className="doctor-intro">{doc.doctor_introduction}</div>
      )}

      <div className="doctor-details">
        <div className="consultation-fee">
          <span className="fee-label">Consultation Fee:</span>
          <span className="fee-amount">{doc.fees}</span>
        </div>

        <div className="consultation-modes">
          {doc.video_consult && <span className="mode-tag video-consult">Video Consultation</span>}
          {doc.in_clinic && <span className="mode-tag in-clinic">In-Clinic Consultation</span>}
        </div>
      </div>

      {doc.clinic && (
        <div className="clinic-info">
          <div className="clinic-name">{doc.clinic.name}</div>
          <div className="clinic-address">
            {doc.clinic.address?.address_line1 && <div>{doc.clinic.address.address_line1}</div>}
            <div>
              {doc.clinic.address?.locality && `${doc.clinic.address.locality}, `}
              {doc.clinic.address?.city}
            </div>
          </div>
        </div>
      )}

      {doc.languages?.length > 0 && (
        <div className="languages">
          <span className="languages-label">Languages:</span>
          <div className="language-tags">
            {doc.languages.map((lang, index) => (
              <span key={index} className="language-tag">{lang}</span>
            ))}
          </div>
        </div>
      )}

      {!isSuggested && (
        <div className="doctor-actions">
          <button className="book-button" onClick={() => setIsModalOpen(true)}>
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Main doctor */}
      {renderDoctorCard(doctor)}

      {/* Booking Modal */}
      {isModalOpen && doctor && (
        <BookingModal doctor={doctor} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Suggestion */}
      {suggestedDoctor && (
        <div className="suggestions-section">
          <br></br>
          <h1>Some More Suggestion</h1>
          {renderDoctorCard(suggestedDoctor, true)}
        </div>
      )}
    </>
  );
};

export default DoctorDetail;
