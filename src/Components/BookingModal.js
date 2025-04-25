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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setBookingSuccess(true);
      
      // Close modal after success display
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setFormErrors({
        submit: "There was an error booking your appointment. Please try again."
      });
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
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={formErrors.name ? "error" : ""}
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
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={formErrors.date ? "error" : ""}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                  {formErrors.date && <div className="error-message">{formErrors.date}</div>}
                </div>
                
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    name="time" 
                    value={formData.time}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={formErrors.time ? "error" : ""}
                  />
                  {formErrors.time && <div className="error-message">{formErrors.time}</div>}
                </div>
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