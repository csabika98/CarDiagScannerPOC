import GroupComponent from "./group-component";
import PropTypes from "prop-types";
import styles from "./report-time.module.css";
import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import react-modal

Modal.setAppElement('#__next');
const ReportTimeFront = ({ className = "" }) => {
  const [processedImages, setProcessedImages] = useState({
    front: null,
    left: null,
    right: null,
    back: null,
  });
  const [damages, setDamages] = useState({
    front: [],
    left: [],
    right: [],
    back: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalImage, setModalImage] = useState(null); // Store image for modal
  const [currentDate, setCurrentDate] = useState(""); // State to hold the current date


  useEffect(() => {
    // Retrieve processed images and damages from sessionStorage
    const uploadedImages = JSON.parse(sessionStorage.getItem("uploadedImages")) || {};
  
    // Front processed image and damages
    if (uploadedImages.frontProcessed) {
      setProcessedImages((prevImages) => ({
        ...prevImages,
        front: uploadedImages.frontProcessed
      }));
    }
    if (uploadedImages.frontDamages) {
      setDamages((prevDamages) => ({
        ...prevDamages,
        front: uploadedImages.frontDamages
      }));
    }
  
    // Right processed image and damages
    if (uploadedImages.rightProcessed) {
      setProcessedImages((prevImages) => ({
        ...prevImages,
        right: uploadedImages.rightProcessed
      }));
    }
    if (uploadedImages.rightDamages) {
      setDamages((prevDamages) => ({
        ...prevDamages,
        right: uploadedImages.rightDamages
      }));
    }
  
    // Left processed image and damages
    if (uploadedImages.leftProcessed) {
      setProcessedImages((prevImages) => ({
        ...prevImages,
        left: uploadedImages.leftProcessed
      }));
    }
    if (uploadedImages.leftDamages) {
      setDamages((prevDamages) => ({
        ...prevDamages,
        left: uploadedImages.leftDamages
      }));
    }
  
    // Back processed image and damages
    if (uploadedImages.backProcessed) {
      setProcessedImages((prevImages) => ({
        ...prevImages,
        back: uploadedImages.backProcessed
      }));
    }
    if (uploadedImages.backDamages) {
      setDamages((prevDamages) => ({
        ...prevDamages,
        back: uploadedImages.backDamages
      }));
    }
    // Generate today's date and set it in the state
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    setCurrentDate(formattedDate);
  
  
  }, []);
  


  const openModal = (side) => {
    setModalImage(processedImages[side]); // Set modal image based on the side clicked
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null); // Reset modal image
  };

  return (
    <div className={[styles.reportTime, className].join(" ")}>
      <h1 className={styles.partsOverview}>Front damage overview</h1>

      {/* Only display the front section if there is processed front image or front damages */}
      {(processedImages.front || damages.front.length > 0) && (
        <>  
      
          <button className={styles.overviewElements} />
          <GroupComponent
            className={styles.frontGroup} // Add a new class for the front group
            processedImage={processedImages.front} // The processed front image
            side="front" // Pass the side of the car
            onClick={() => openModal('front')} // Handle modal open on click with side
          />
          <div className={styles.costBreakdown} >
            <div className={styles.repairCost}>
              <div className={styles.inr80052}>INR </div>
              <div className={styles.estimatedRepairCost}>Estimated repair cost</div>
            </div>
            <div className={styles.replaceCost}>
              <div className={styles.emptyLabel}></div>
              <div className={styles.estimatedReplaceCost}>Estimated replace cost</div>
            </div>
            <div className={styles.frontLabelParent}>
              <div className={styles.frontLabel}>
                <h3 className={styles.front}>
                  <ul>Front</ul>                 {/* <ul>
                    {damages.front.length > 0 ? (
                      damages.front.map((damage, index) => (
                        <li key={index} className={styles.damagePart}>
                          {damage.part} {/* Only display the part */}
                      {/* ))
                    ) : (
                      <p>No damages detected.</p>
                    )}
                  </ul> */}
                </h3>
              </div>
            </div>
          </div>
     
        </>
      )}  

        {/* Modal for enlarged processed image */}
        <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Processed Image Modal"
        className={styles.modal} // Modal specific style
        overlayClassName={styles.overlay} // Background overlay style
      >
        {/* Apply the new class */}
        {modalImage && (
          <img className={styles.modalImage} src={modalImage} alt="Processed Image" />
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
      {/* <div className={styles.leftFrontAnalysis}>
    <div className={styles.leftFrontAnalysisChild} />
    <h3 className={styles.leftFrontView}>
      Left front view
    </h3>
    <div className={styles.leftFrontAnalysisItem} />
    <div className={styles.leftFrontDetails}>
      <div className={styles.leftFrontSummary}>
        <div className={styles.leftFrontDamagePhotos}>
          <div
            className={styles.uploadedPhotosContainer}
          >
            <div
              className={styles.uploadedPhotosContent}
            >
              <div
                className={styles.uploadedPhotosTitle}
              >
                <div
                  className={styles.uploadedPhotos}
                >
                  Uploaded photos
                </div>
                <div
                  className={styles.photosPlaceholder}
                >
                  (3)
                </div>
              </div>
              <div className={styles.photosGrid}>
                <div
                  className={styles.photoRowOneParent}
                >
                  <img
                    className={styles.photoRowOne}
                    loading="lazy"
                    alt=""
                    src="/cardiag/rectangle-41@2x.png"
                  />
                  <div
                    className={styles.photoRowTwo}
                  />
                </div>
                <div
                  className={styles.photoRowOneParent}
                >
                  <img
                    className={styles.rectangleIcon}
                    loading="lazy"
                    alt=""
                    src="/cardiag/rectangle-42@2x.png"
                  />
                  <div
                    className={styles.frameChild4}
                  />
                </div>
              </div>
            </div>
            <div className={styles.damagedParts}>
              <a className={styles.damagedParts1} />
              <div className={styles.total}>
                (4 total)
              </div>
            </div>
          </div>
          <div className={styles.recommendationBadge}>
            <div
              className={styles.badgeBackgroundParent}
            >
              <img
                className={styles.rectangleIcon}
                alt=""
                src="/cardiag/badge-background@2x.png"
              />
              <img
                className={styles.frameChild5}
                alt=""
                src="/cardiag/rectangle-55.svg"
              />
            </div>
          </div>
        </div>
        <div
          className={styles.outerPartsLeftContainer}
        >
          <span>Outer parts:</span>
          <span className={styles.leftFrontBumper}>
            {" "}
            left front bumper, headlights
          </span>
        </div>
        <div
          className={styles.outerPartsLeftContainer}
        >
          <span>{`Recommended resolution: `}</span>
          <span className={styles.leftFrontBumper}>
            replacement
          </span>
        </div>
      </div>
      <div className={styles.editIcon}>
        <button className={styles.rectangleContainer}>
          <div className={styles.frameChild6} />
          <img
            className={styles.editIconShape}
            alt=""
            src="/cardiag/vector-1.svg"
          />
        </button>
      </div>
    </div>
  </div> */}
{/*                    
      <div className={styles.flatViewImageParent}>
        <div className={styles.flatViewImage} />
        <button className={styles.flatView}>
          <div className={styles.flatView1}>Flat view</div>
        </button>
      </div>




               

                  
      <div className={styles.partsIconParent}>
        <img
          className={styles.partsIcon}
          loading="lazy"
          alt=""
          src="/cardiag/vector.svg"
        />
        <div className={styles.groupParent}>
          <button className={styles.groupWrapper}>
            <img
              className={styles.groupChild}
              alt=""
              loading="lazy"
              src="/cardiag/group-64.svg"
            />
          </button>
          <button className={styles.groupContainer}>
            <img
              className={styles.groupChild}
              alt=""
              loading="lazy"
              src="/cardiag/group-65.svg"
            />
          </button>
        </div>
      </div>
      <div className={styles.groupDiv}>
        <button className={styles.groupWrapper}>
          <img
            className={styles.groupChild}
            alt=""
            loading="lazy"
            src="/cardiag/group-641.svg"
          />
        </button>
        <button className={styles.groupContainer}>
          <img
            className={styles.groupChild}
            alt=""
            loading="lazy"
            src="/cardiag/group-65.svg"
          />
        </button>
      </div> */}
     
      {/* Report time section */}
      <div className={styles.reportTime28032024}>
        Report time: {currentDate}
      </div>

    </div>
  );
  }
  


  ReportTimeFront.propTypes = {
  className: PropTypes.string,
};

export default ReportTimeFront;
