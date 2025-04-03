import PropTypes from "prop-types";
import styles from "./general-info-container.module.css";
import { useEffect, useState } from 'react';
import Modal from 'react-modal';


Modal.setAppElement('#__next'); // Required for accessibility when using React Modal

const GeneralInfoContainer = ({ className = "" }) => {
  const baseImages = {
    front: "/cardiag/image-20@2x.png",
    left: "/cardiag/image-18@2x.png",
    back: "/cardiag/image-17@2x.png",
    right: "/cardiag/group-10@2x.png",
  };

  const [frontImage, setFrontImage] = useState(baseImages.front);
  const [leftImage, setLeftImage] = useState(baseImages.left);
  const [backImage, setBackImage] = useState(baseImages.back);
  const [rightImage, setRightImage] = useState(baseImages.right);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [carDetails, setCarDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalImage, setModalImage] = useState(null); // Store image for modal
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const selectedMake = sessionStorage.getItem('selectedMake');
    const selectedModel = sessionStorage.getItem('selectedModel');
    console.log(selectedMake, selectedModel);
  
    if (selectedMake && selectedModel) {
      setCarDetails(`${selectedMake}, ${selectedModel}`);
      
    }

   // Retrieve the uploaded images from sessionStorage
  const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};

  // Check and set images only if they are not the base images
  let count = 0;  // Initialize the count

  if (uploadedImages.front && uploadedImages.front !== baseImages.front) {
    setFrontImage(uploadedImages.front);
    count++;  // Increment count for an uploaded image
  } else {
    setFrontImage(baseImages.front);  // Set to base image if no uploaded image
  }

  if (uploadedImages.left && uploadedImages.left !== baseImages.left) {
    setLeftImage(uploadedImages.left);
    count++;  // Increment count for an uploaded image
  } else {
    setLeftImage(baseImages.left);  // Set to base image if no uploaded image
  }

  if (uploadedImages.back && uploadedImages.back !== baseImages.back) {
    setBackImage(uploadedImages.back);
    count++;  // Increment count for an uploaded image
  } else {
    setBackImage(baseImages.back);  // Set to base image if no uploaded image
  }

  if (uploadedImages.right && uploadedImages.right !== baseImages.right) {
    setRightImage(uploadedImages.right);
    count++;  // Increment count for an uploaded image
  } else {
    setRightImage(baseImages.right);  // Set to base image if no uploaded image
  }

  // Update the uploaded image count
  setUploadedCount(count);
}, [baseImages]);

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc); // Set modal image based on the side clicked
    setIsModalOpen(true);

    // Optional: Trigger animation by adding a CSS class
    document.body.classList.add('animate-highlight');
    setTimeout(() => {
      document.body.classList.remove('animate-highlight');
    }, 300); // Adjust the timeout duration to match the animation length
  };


  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null); // Reset modal image
  };



  return (
    <div className={[styles.generalInfoContainer, className].join(" ")}>
      <h1 className={styles.generalInformation}>General information</h1>
      <h2 className={styles.repairShopPartners}>Repair shop partners</h2>
      <div className={styles.viewAllDescription}>({uploadedCount})</div>
      <img
        className={styles.vectorIcon}
        loading="lazy"
        alt=""
        src="/cardiag/vector-1.svg"
      />
      <a className={styles.viewAll} />
      <h2 className={styles.uploadedPhotos}>Uploaded photos</h2>
      <div className={styles.fiatBravo2009}>{carDetails || "Select a car"}</div>     
      
      <div className={styles.uploadedPhotosContainer}>
        <div className={styles.uploadedPhotosDetailsWrapper}>
          {/* Display the uploaded image */}
     
          <button className={styles.uploadedPhotosDetails}>
            <img
              className={styles.carLight11}
              loading="lazy"
              alt=""
              src="/cardiag/carlight-1-1.svg"
            />
            <div className={styles.carDetails}>Car details</div>
          </button>
        </div>
      </div>
      <button className={styles.clockRotateLeftLight11Parent}>
        <img
          className={styles.clockRotateLeftLight11}
          alt=""
          src="/cardiag/clockrotateleftlight-1-1.svg"
        />
        <div className={styles.carDetails}>Accident history</div>
      </button>
      <button className={styles.filesLight11Parent}>
        <img
          className={styles.filesLight11}
          loading="lazy"
          alt=""
          src="/cardiag/fileslight-1-1.svg"
        />
        <div className={styles.carDetails}>Accident claim details</div>
      </button>
      <button className={styles.driverInformationContainer}>
        <img className={styles.userLight1Icon} alt="" src="/cardiag/userlight-1.svg" />
        <div className={styles.carDetails}>Driver information</div>
      </button>
            
        {/* Display the uploaded images as clickable items, set to null if they are base images */}
    {frontImage !== "/cardiag/image-20@2x.png" && frontImage && (
      <img
        className={styles.generalInfoContainerChild}
        src={frontImage} // Using the Base64 string directly
        alt="Uploaded front image"
        onClick={() => openModal(frontImage)}
        style={{ cursor: 'pointer' }}
      />
    )}
    {leftImage !== "/cardiag/image-18@2x.png" && leftImage && (
      <img
        className={styles.partnerLogoIcon}
        src={leftImage}
        alt="Uploaded left image"
        onClick={() => openModal(leftImage)}
        style={{ cursor: 'pointer' }}
      />
    )}
    {backImage !== "/cardiag/image-17@2x.png" && backImage && (
      <img
        className={styles.generalInfoContainerItem}
        src={backImage}
        alt="Uploaded back image"
        onClick={() => openModal(backImage)}
        style={{ cursor: 'pointer' }}
      />
    )}
    {rightImage !== "/cardiag/group-10@2x.png" && rightImage && (
      <img
        className={styles.generalInfoContainerInner}
        src={rightImage}
        alt="Uploaded right image"
        onClick={() => openModal(rightImage)}
        style={{ cursor: 'pointer' }}
      />
    )}
      {/* Modal to display the clicked image */}
      <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Processed Image Modal"
          className={`${styles.modal} ${isModalOpen ? 'modal-open' : ''}`}
          overlayClassName={styles.overlay}
        >
          <button className={styles.closeButton} onClick={closeModal}>
            &times;
          </button>
          {selectedImage && (
            <img className={styles.modalImage} src={selectedImage} alt="Processed Image" />
          )}
        </Modal>
      <img
        className={styles.groupIcon}
        loading="lazy"
        alt=""
        src="/cardiag/group.svg"
      />
      <img
        className={styles.vectorIcon1}
        loading="lazy"
        alt=""
        src="/cardiag/vector-1.svg"
      />
      <a className={styles.viewAll1} />
    
      <img
        className={styles.ongzp04862Icon}
        loading="lazy"
        alt=""
        src="/cardiag/107574ongzp0486-2@2x.png"
      />
      <div className={styles.abcCarRepair}>ABC Car Repair Ltd.</div>
    </div>
  );
};

GeneralInfoContainer.propTypes = {
  className: PropTypes.string,
};

export default GeneralInfoContainer;
