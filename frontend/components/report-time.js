import GroupComponent from "./group-component";
import PropTypes from "prop-types";
import styles from "./report-time.module.css";
import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Import react-modal

Modal.setAppElement('#__next');
const ReportTime = ({ className = "" }) => {
  const [isLeftFrontVisible, setIsLeftFrontVisible] = useState(false);
  const [isLeftBackVisible, setIsLeftBackVisible] = useState(false);
  const [isRightFrontVisible, setIsRightFrontVisible] = useState(false);
  const [isRightBackVisible, setIsRightBackVisible] = useState(false);
 
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
   // Adjusted button click handlers to hide other sections
   const handleLeftFrontButtonClick = () => {
    setIsLeftFrontVisible(!isLeftFrontVisible);
    setIsLeftBackVisible(false);
    setIsRightFrontVisible(false);
    setIsRightBackVisible(false);
  };

  const handleLeftBackButtonClick = () => {
    setIsLeftBackVisible(!isLeftBackVisible);
    setIsLeftFrontVisible(false);
    setIsRightFrontVisible(false);
    setIsRightBackVisible(false);
  };

  const handleRightFrontButtonClick = () => {
    setIsRightFrontVisible(!isRightFrontVisible);
    setIsLeftFrontVisible(false);
    setIsLeftBackVisible(false);
    setIsRightBackVisible(false);
  };

  const handleRightBackButtonClick = () => {
    setIsRightBackVisible(!isRightBackVisible);
    setIsLeftFrontVisible(false);
    setIsLeftBackVisible(false);
    setIsRightFrontVisible(false);
  };
  return (
    <div className={[styles.reportTime, className].join(" ")}>
      <h1 className={styles.partsOverview}>Parts overview</h1>

      {/* Only display the front section if there is processed front image or front damages */}
      {(processedImages.front || damages.front.length > 0) && (
        <>
          <button className={styles.overviewElements} />
          <GroupComponent
            processedImage={processedImages.front} // The processed front image
            side="front" // Pass the side of the car
            onClick={() => openModal('front')} // Handle modal open on click with side
          />
          <div className={styles.costBreakdown}>
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
                <ul>
                    {damages.front.length > 0 ? (
                      damages.front.map((damage, index) => (
                        <li key={index} className={styles.damagePart}>
                          {damage.part} {/* Only display the part */}
                        </li>
                      ))
                    ) : (
                      <p>No damages detected.</p>
                    )}
                  </ul>
                </h3>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Only display the left section if there is processed left image or left damages */}
      {(processedImages.left || damages.left.length > 0) && (
        <>
          <button className={styles.overviewElements1} />
          <GroupComponent
            propTop="653px"
            side="left"
            processedImage={processedImages.left} // The processed left image
            onClick={() => openModal('left')} // Handle modal open on click
          />
          <div className={styles.costSummary}>
            <div className={styles.costValues}>
              <div className={styles.div}>INR </div>
              <div className={styles.estimatedRepairCost1}>Estimated repair cost</div>
            </div>
            <div className={styles.costValues1}>
              <div className={styles.div}></div>
              <div className={styles.estimatedRepairCost1}>Estimated replace cost</div>
            </div>
            <div className={styles.backDamage}>
              <div className={styles.backLabel}>
                <h3 className={styles.front}>
                  <ul>
                  {damages.left.length > 0 ? (
                      damages.left.map((damage, index) => (
                        <li key={index} className={styles.damagePart}>
                          {damage.part} {/* Only display the part */}
                        </li>
                      ))
                    ) : (
                      <p>No damages detected.</p>
                    )}
                  </ul>
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
       {/* Only display the left section if there is processed left image or left damages */}
       {(processedImages.back || damages.back.length > 0) && (
        <>
          <button className={styles.overviewElements2} />
          <GroupComponent
            propTop="800px"
            side="back"
            processedImage={processedImages.back} // The processed left image
            onClick={() => openModal('back')} // Handle modal open on click
          />
          <div className={styles.costSummary} style={{ top:"800px" }}>
            <div className={styles.costValues}>
              <div className={styles.div}>INR </div>
              <div className={styles.estimatedRepairCost1}>Estimated repair cost</div>
            </div>
          
          <div className={styles.costValues1}>
              <div className={styles.div}></div>
              <div className={styles.estimatedRepairCost1}>Estimated replace cost</div>
            </div>
            </div>
          
          <div className={styles.backDamage}>
          <div className={styles.backLabel}>
          <h3 className={styles.front2}>
                  <ul>
                  {damages.back.length > 0 ? (
                      damages.back.map((damage, index) => (
                        <li key={index} className={styles.damagePart}>
                          {damage.part} {/* Only display the part */}
                        </li>
                      ))
                    ) : (
                      <p>No damages detected.</p>
                    )}
                  </ul>
                </h3>
                
             
                </div>
                </div>
    
        </>
      )}
      {/* Only display the left section if there is processed left image or left damages */}
      {(processedImages.right || damages.right.length > 0) && (
        <>
          <button className={styles.overviewElements3} />
          <GroupComponent
            propTop="950px"
            side="right"
            processedImage={processedImages.right} // The processed left image
            onClick={() => openModal('right')} // Handle modal open on click
          />
           <div className={styles.costSummary} style={{ top:"950px" }}>
            <div className={styles.costValues}>
              <div className={styles.div}>INR </div>
              <div className={styles.estimatedRepairCost1}>Estimated repair cost</div>
            </div>
          
          <div className={styles.costValues1}>
              <div className={styles.div}></div>
              <div className={styles.estimatedRepairCost1}>Estimated replace cost</div>
            </div>
            </div>
          <div className={styles.backDamage}>
          <div className={styles.backLabel}>
          <h3 className={styles.front3}>
                  <ul>
                  
                  {damages.right.length > 0 ? (
                      damages.right.map((damage, index) => (
                        <li key={index} className={styles.damagePart}>
                          {damage.part} {/* Only display the part */}
                        </li>
                      ))
                    ) : (
                      <p>No damages detected.</p>
                    )}
                  
                  </ul>
                </h3>
                
             
                </div>
                </div>
    
        </>
      )}

        {/* Modal for enlarged processed image */}
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
          {modalImage && (
            <img className={styles.modalImage} src={modalImage} alt="Processed Image" />
          )}
        </Modal>
                   
      <div className={styles.flatViewImageParent}>
        <div className={styles.flatViewImage} />
        <button className={styles.flatView}>
          <div className={styles.flatView1}>Flat view</div>
        </button>
      </div>
      <div
        className={`${styles.hiddenContent} ${isLeftFrontVisible ? styles.visible : ''}`}
      >
        <img
          className={styles.frameChild4}
          alt=""
          src="/cardiag/group-70.svg"
        />
        <img
          className={styles.rectangleIcon}
          alt=""
          src="/cardiag/rectangle-58.svg"
        />
          <div className={styles.overviewBottomBorder}>
          <h3 className={styles.leftFrontView} style={{position:'absolute'}}>
            Left front view
          </h3>
          <GroupComponent
            processedImage={processedImages.front} // The processed front image
            side="front" // Pass the side of the car
            onClick={() => openModal('front')} // Handle modal open on click with side
            style={{cursor: "pointer", position: 'absolute',top: "100px", left:'20px'}}
            ></GroupComponent> 
   
         
              <div  className={styles.uploadedPhotosTitle}
              >
                <div
                  className={styles.photosPlaceholder} style={{position: 'absolute', top: '60px', left: '20px'}}
                >
                  Uploaded photos (1)
                </div>
                </div>
        </div>


       
         </div>
      <div
        className={`${styles.hiddenContent} ${isLeftBackVisible ? styles.visible : ''}`}
      >
        <img
          className={styles.frameChild4LeftBack}
          alt=""
          src="/cardiag/group-70.svg"
        />
        <img
          className={styles.rectangleIconLeftBack}
          alt=""
          src="/cardiag/rectangle-58.svg"
        />
          <div className={styles.overviewBottomBorder}>
          <h3 className={styles.leftFrontView} style={{position:'absolute'}}>
            Left back view
          </h3>
          <GroupComponent
            processedImage={processedImages.back} // The processed front image
            side="back" // Pass the side of the car
            onClick={() => openModal('back')} // Handle modal open on click with side
            style={{cursor: "pointer", position: 'absolute',top: "100px", left:'20px'}}
            ></GroupComponent> 
   
         
              <div  className={styles.uploadedPhotosTitle}
              >
                <div
                  className={styles.photosPlaceholder} style={{position: 'absolute', top: '60px', left: '20px'}}
                >
                  Uploaded photos (1)
                </div>
                </div>
        </div>


       
         </div>
         <div className={`${styles.hiddenContent} ${isRightFrontVisible ? styles.visible : ''}`}
      >
        <img
          className={styles.frameChild4RightFront}
          alt=""
          src="/cardiag/group70.png"
        />
        <img
          className={styles.rectangleIconRightFront}
          alt=""
          src="/cardiag/rectangle-58.svg"
        />
          <div className={styles.overviewBottomBorderRightFront}>
          
          
          <h3 className={styles.leftFrontView} style={{position:'absolute'}}>
            Right front view
          </h3>
          
          
          <GroupComponent
                processedImage={processedImages.right} // The processed front image
                side="right" // Pass the side of the car
                onClick={() => openModal('right')} // Handle modal open on click with side
                style={{cursor: "pointer", position: 'absolute',top: "100px", left:'20px'}}
                ></GroupComponent>
              
              <div  className={styles.uploadedPhotosTitle}
              >
                <div
                  className={styles.photosPlaceholder} style={{position: 'absolute', top: '60px', left: '20px'}}
                >
                  Uploaded photos (1)
                </div>
                
                </div>
        </div>


       
         </div>
         <div className={`${styles.hiddenContent} ${isRightBackVisible ? styles.visible : ''}`}
      >
        <img
          className={styles.frameChild4RightBack}
          alt=""
          src="/cardiag/group70.png"
        />
        <img
          className={styles.rectangleIconRightBack}
          alt=""
          src="/cardiag/rectangle-58.svg"
        />
          <div className={styles.overviewBottomBorderRightBack}>
          <h3 className={styles.leftFrontView} style={{position:'absolute'}}>
            Right back view
          </h3>
          <GroupComponent
            processedImage={processedImages.left} // The processed front image
            side="left" // Pass the side of the car
            onClick={() => openModal('left')} // Handle modal open on click with side
            style={{cursor: "pointer", position: 'absolute',top: "100px", left:'20px'}}
            ></GroupComponent> 
   
         
              <div  className={styles.uploadedPhotosTitle}
              >
                <div
                  className={styles.photosPlaceholder} style={{position: 'absolute', top: '60px', left: '20px'}}
                >
                  Uploaded photos (1)
                </div>
                </div>
        </div>


       
         </div>
      
        
          <div className={styles.partsIconParent}>
         
          <img
            className={(isLeftFrontVisible || isLeftBackVisible || isRightBackVisible || isRightFrontVisible) ? styles.partsIconVisibleFront : styles.partsIcon}
            loading="lazy"
            alt=""
            src="/cardiag/vector.svg"
          />

        <div className={isRightBackVisible? styles.groupDivVisibleFront : isRightFrontVisible ? styles.groupDivVisibleFront : isLeftFrontVisible ? styles.groupDivVisibleFront : isLeftBackVisible ? styles.groupDivVisibleBack : styles.groupDiv}>
        
        <button className={styles.groupWrapper} onClick={handleLeftFrontButtonClick}>
          <img
            className={styles.groupChild}
            alt=""
            loading="lazy"
            src="/cardiag/group-641.svg"
          />
        </button>

        <button className={styles.groupContainer} onClick={handleLeftBackButtonClick}>
          <img
            className={styles.groupChild}
            alt=""
            loading="lazy"
            src="/cardiag/group-65.svg"
          />
        </button>
   
        <div className={isRightFrontVisible ? styles.groupParentRightVisibleFront : isRightBackVisible ? styles.groupParentRightVisibleBack : styles.groupParent}>
        <button className={styles.groupWrapper} onClick={handleRightFrontButtonClick}>
        <img
          className={styles.groupChild}
          alt="Front Damage"
          loading="lazy"
          src="/cardiag/group-64.svg"
        />
      </button>
          <button className={styles.groupContainer} onClick={handleRightBackButtonClick}>
            <img
              className={styles.groupChild}
              alt=""
              loading="lazy"
              src="/cardiag/group-65.svg"
            />
          </button>
       
        </div>
      </div>
      </div>
      
     
      {/* Report time section */}
      <div className={styles.reportTime28032024}>
        Report time: {currentDate}
      </div>
      
    </div>
  );
  }
  


ReportTime.propTypes = {
  className: PropTypes.string,
};

export default ReportTime;
