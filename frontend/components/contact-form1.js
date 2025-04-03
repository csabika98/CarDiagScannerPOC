import React, { useState } from 'react';
import { useRouter } from 'next/router';

const ContactForm1 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    frontImage: null,
    doorImage: null,
  });
  const [loading, setLoading] = useState(false); // State to handle loading

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0], // Only accept the first file
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    // Create form data for submission
    const uploadData = new FormData();
    uploadData.append('make', formData.make);
    uploadData.append('model', formData.model);
    uploadData.append('year', formData.year);
    uploadData.append('file', formData.frontImage); // First file
    uploadData.append('file', formData.doorImage);  // Second file

    try {
      // Submit form data to Flask backend
      const response = await fetch('https://sallai.tech/cardiag/backend/upload', {
        method: 'POST',
        body: uploadData,
      });      

      if (response.ok) {
        const data = await response.json();
        // Redirect to results page with the returned data
        router.push({
          pathname: '/cardiag/results',
          query: { 
            original_image_url: data.original_image_url,
            modified_image_url: data.modified_image_url,
            damages: JSON.stringify(data.damages), // Pass damages as stringified JSON
            make: formData.make,
            model: formData.model,
            year: formData.year
          },
        });
      } else {
        console.error('Form submission failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  return (
    <div id="contact-form" className="contact-form1-contact1 thq-section-padding">
      {loading ? (
        <div>Loading... Please wait while we process your car images.</div>
      ) : (
        <div className="contact-form1-max-width thq-section-max-width">
          <div className="contact-form1-container1">
            <div className="contact-form1-section-title thq-card">
              <h2>Let's start with your car!</h2>
              <h2>We will scan your car, then we will identify the damages!</h2>
            </div>
            <form className="thq-card" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="contact-form1-container2">
                {/* Car Make */}
                <label htmlFor="make">Car Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="contact-form1-text-input1 thq-input"
                />

                {/* Car Model */}
                <label htmlFor="model">Car Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="contact-form1-text-input2 thq-input"
                />

                {/* Car Year */}
                <label htmlFor="year">Car Year</label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="contact-form1-text-input3 thq-input"
                />

                {/* Front Car Image */}
                <label htmlFor="frontImage">Upload Pic of Front of Car</label>
                <input
                  type="file"
                  id="frontImage"
                  name="frontImage"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  required
                  className="contact-form1-text-input4 thq-input"
                />

                {/* Front Door Image */}
                <label htmlFor="doorImage">Upload Pic of Front Door</label>
                <input
                  type="file"
                  id="doorImage"
                  name="doorImage"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  required
                  className="contact-form1-text-input4 thq-input"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="contact-form1-checkbox1 thq-flex-row">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="thq-checkbox"
                />
                <label htmlFor="terms" className="thq-body-small">
                  I accept the Terms
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="contact-form1-button thq-button-filled">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Styling for the component */}
      <style jsx>{`
        .contact-form1-contact1 {
          width: 1200px;
          height: 1017px;
          display: flex;
          position: relative;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }
        .contact-form1-max-width {
          width: 432px;
          display: flex;
          align-items: flex-start;
          flex-direction: column;
        }
        .contact-form1-container1 {
          display: flex;
          position: relative;
          align-items: stretch;
          flex-direction: column;
        }
        .contact-form1-section-title {
          align-self: flex-start;
        }
        .contact-form1-container2 {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          align-self: stretch;
          align-items: stretch;
          flex-direction: column;
          justify-content: center;
        }
        .contact-form1-input1,
        .contact-form1-input2,
        .contact-form1-input3,
        .contact-form1-input4 {
          width: 100%;
          align-self: flex-start;
          justify-content: space-between;
        }
        .contact-form1-text-input1,
        .contact-form1-text-input2,
        .contact-form1-text-input3,
        .contact-form1-text-input4 {
          flex: 1;
        }
        .contact-form1-checkbox1 {
          align-self: flex-start;
        }
        .contact-form1-button {
          align-self: flex-start;
        }

        @media (max-width: 991px) {
          .contact-form1-input1,
          .contact-form1-input2,
          .contact-form1-input3,
          .contact-form1-input4 {
            align-items: center;
            flex-direction: row;
          }
          .contact-form1-checkbox1 {
            width: 100%;
            align-items: center;
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactForm1;

