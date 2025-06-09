import React, { useState } from 'react';

const BookingModal = ({ doctor, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const availableTimeSlots = [
    '09:00', '10:00', '11:30', '12:00', '16:00',
    '17:00', '17:30', '18:00', '20:00'
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.date) errors.date = "Date is required";
    if (!formData.time) errors.time = "Time is required";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'date') {
      setSelectedTimeSlot('');
      setFormData(prev => ({ ...prev, time: '' }));
      if (formErrors.time) {
        setFormErrors(prev => ({ ...prev, time: null }));
      }
    } else {
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
    setFormData(prev => ({
      ...prev,
      time: time
    }));
    if (formErrors.time) {
      setFormErrors(prev => ({
        ...prev,
        time: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Prepare payload for Formspree API
      const payload = {
        doctor: doctor.name,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      };

      const response = await fetch("https://formspree.io/f/xqkovnyy", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setBookingSuccess(true);
        // Optionally clear form data here if you want
        // setFormData({ name:'', phone:'', email:'', date:'', time:'', notes:'' });
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const data = await response.json();
        let errorMsg = 'Error submitting form. Please try again.';
        if (data && data.errors) {
          errorMsg = data.errors.map(err => err.message).join(', ');
        }
        setFormErrors({ submit: errorMsg });
      }
    } catch (err) {
      setFormErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <button className="close-modal" onClick={onClose} disabled={isSubmitting}>
          &times;
        </button>

        {bookingSuccess ? (
          <div className="booking-success">
            <h2>Appointment Booked!</h2>
            <p>Your appointment with {doctor.name} has been scheduled for {formData.date} at {formData.time}.</p>
            <p>A confirmation has been sent to your email.</p>
          </div>
        ) : (
          <>
            <h2>Book Appointment with {doctor.name}</h2>

            <div className="doctor-info">
              <img
                src={doctor.photo}
                alt={doctor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100';
                }}
              />
              <div>
                <h3>{doctor.specialities[0]?.name || 'General Physician'}</h3>
                <p>{doctor.experience}</p>
                <p className="fee">{doctor.fees}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.name ? "error" : ""}
                  required
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.phone ? "error" : ""}
                  required
                />
                {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.email ? "error" : ""}
                  required
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.date ? "error" : ""}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {formErrors.date && <div className="error-message">{formErrors.date}</div>}
              </div>

              <div className="form-group">
                <label>Select Time</label>
                {formData.date ? (
                  <div className="time-slots-container">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot-btn ${selectedTimeSlot === time ? 'selected' : ''}`}
                        onClick={() => handleTimeSlotSelect(time)}
                        disabled={isSubmitting}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="info-text">Please select a date first to choose a time slot.</p>
                )}
                {formErrors.time && <div className="error-message">{formErrors.time}</div>}
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {formErrors.submit && <div className="form-error">{formErrors.submit}</div>}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
