import ButtonBase from "../components/button-base";
import styles from "./index.module.css";
import { useRouter } from "next/router"; // Import useRouter
import React, { useEffect, useState } from 'react';


const Desktop = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  

  useEffect(() => {
    const selectedMake = sessionStorage.getItem("selectedMake");
    const selectedModel = sessionStorage.getItem("selectedModel");

    if (!selectedMake || !selectedModel) {
      alert("Please select a car make and model before proceeding.");
      router.push("/home"); // Redirect to the main selection page
    } else {
      setIsAuthorized(true);
    }

    setIsCheckingAuth(false); 
  }, [router]);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const resetInput = (e) => {
    e.target.value = null; // Reset the input field to allow re-upload of the same file if needed
  };
  

  // State for different views of the car
  const [frontImage, setFrontImage] = useState("/cardiag/image-20@2x.png");
  const [leftImage, setLeftImage] = useState("/cardiag/image-18@2x.png");
  const [backImage, setBackImage] = useState("/cardiag/image-17@2x.png");
  const [rightImage, setRightImage] = useState("/cardiag/group-10@2x.png");
  const [detectedDamages, setDetectedDamages] = useState([]); // State to store detected damages


  if (isCheckingAuth) {
    // While checking authorization, render nothing or a loading spinner
    return null;
  }

  if (!isAuthorized) {
    // If not authorized, do not render the rest of the page
    return null;
  }




  //  // Handlers for image uploads
  //  const handleFrontImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setFrontImage(imageUrl);
  //   }
  // };
  const handleFrontImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', new Date().getTime()); // Add timestamp to ensure unique request
  
        // Upload image to MongoDB
        const mongoDbResponse = await fetch('/cardiag/api/upload', {
            method: 'POST',
            body: formData,
        });
        const mongoDbResult = await mongoDbResponse.json();
  
        if (mongoDbResult.fileId) {
            const imageUrl = `/cardiag/api/image/${mongoDbResult.fileId}`;
            const imageBlobResponse = await fetch(imageUrl, { cache: 'no-store' });
            const imageBlob = await imageBlobResponse.blob();
  
            const base64Image = await blobToBase64(imageBlob);
  
            if (base64Image !== "/cardiag/image-20@2x.png") {
                setFrontImage(base64Image); // Set the uploaded image for front
  
                const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
                uploadedImages.front = base64Image; // Store original front image
                sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
            }
  
            // Send the image to Flask backend for damage detection
            const flaskResponse = await fetch('https://sallai.tech/cardiag/backend/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Cache-Control': 'no-cache' // Prevent backend from caching
                }
            });
  
            const flaskResult = await flaskResponse.json();
  
            // Processed image and damages
            if (flaskResult.modified_image_url) {
const imageBlobResponse = await fetch(`https://sallai.tech${flaskResult.modified_image_url}`, { cache: 'no-store' });
                const imageBlob = await imageBlobResponse.blob();
                const base64ProcessedImage = await blobToBase64(imageBlob);
  
                setFrontImage(base64ProcessedImage); // Update front image to the processed version
  
                const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
                uploadedImages.frontProcessed = base64ProcessedImage; // Store processed front image
                uploadedImages.frontDamages = flaskResult.damages; // Store front damages
                sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  
                setDetectedDamages((prevDamages) => ({
                    ...prevDamages,
                    front: flaskResult.damages, // Store damages for the front
                }));
            }
        }
  
        resetInput(e); // Reset the input to allow re-upload of the same file
    }
};

  
  
  
  
const handleLeftImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', new Date().getTime()); // Add timestamp to ensure unique request

      // Upload image to MongoDB
      const response = await fetch('/cardiag/api/upload', {
          method: 'POST',
          body: formData,
      });
      const result = await response.json();

      if (result.fileId) {
          const imageUrl = `/cardiag/api/image/${result.fileId}`;
          const imageBlobResponse = await fetch(imageUrl, { cache: 'no-store' });
          const imageBlob = await imageBlobResponse.blob();

          // Convert the blob to Base64
          const base64Image = await blobToBase64(imageBlob);

          if (base64Image !== "/cardiag/image-18@2x.png") {
              setLeftImage(base64Image); // Set the uploaded image as Base64 string

              const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
              uploadedImages.left = base64Image; // Save in sessionStorage
              sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
          }

          // Send image to Flask backend for damage detection
          const flaskResponse = await fetch('https://sallai.tech/cardiag/backend/api/upload', {
              method: 'POST',
              body: formData,
              headers: {
                  'Cache-Control': 'no-cache' // Prevent backend from caching
              }
          });

          const flaskResult = await flaskResponse.json();

          // Processed image and damages
          if (flaskResult.modified_image_url) {
              const imageBlobResponse = await fetch(`https://sallai.tech${flaskResult.modified_image_url}`, { cache: 'no-store' });
              const imageBlob = await imageBlobResponse.blob();
              const base64ProcessedImage = await blobToBase64(imageBlob);

              setLeftImage(base64ProcessedImage); // Update image to the processed version

              const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
              uploadedImages.leftProcessed = base64ProcessedImage; // Store processed image
              uploadedImages.leftDamages = flaskResult.damages; // Store detected damages
              sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));

              setDetectedDamages((prevDamages) => ({
                  ...prevDamages,
                  left: flaskResult.damages, // Store damages for the left side
              }));
          }
      }
      resetInput(e);  // Reset the input field after processing
  }
};


  
  
  // const handleLeftImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setLeftImage(imageUrl);
  //   }
  // };


  const handleBackImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', new Date().getTime()); // Add timestamp to ensure unique request
  
        // Upload image to MongoDB
        const mongoDbResponse = await fetch('/cardiag/api/upload', {
            method: 'POST',
            body: formData,
        });
        const mongoDbResult = await mongoDbResponse.json();
  
        if (mongoDbResult.fileId) {
            const imageUrl = `/cardiag/api/image/${mongoDbResult.fileId}`;
            const imageBlobResponse = await fetch(imageUrl, { cache: 'no-store' });
            const imageBlob = await imageBlobResponse.blob();
  
            const base64Image = await blobToBase64(imageBlob);
  
            if (base64Image !== "/cardiag/image-17@2x.png") {
                setBackImage(base64Image); // Set the uploaded image for back
  
                const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
                uploadedImages.back = base64Image; // Store original back image
                sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
            }
  
            // Send image to Flask backend for damage detection
            const flaskResponse = await fetch('https://sallai.tech/cardiag/backend/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Cache-Control': 'no-cache' // Prevent backend from caching
                }
            });
  
            const flaskResult = await flaskResponse.json();
  
            // Processed image and damages
            if (flaskResult.modified_image_url) {
            const imageBlobResponse = await fetch(`https://sallai.tech${flaskResult.modified_image_url}`, { cache: 'no-store' });
                const imageBlob = await imageBlobResponse.blob();
                const base64ProcessedImage = await blobToBase64(imageBlob);
  
                setBackImage(base64ProcessedImage); // Update image to the processed version
  
                const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
                uploadedImages.backProcessed = base64ProcessedImage; // Store processed image
                uploadedImages.backDamages = flaskResult.damages; // Store detected damages
                sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  
                setDetectedDamages((prevDamages) => ({
                    ...prevDamages,
                    back: flaskResult.damages, // Store damages for the back
                }));
            }
        }
        resetInput(e);  // Reset the input field after processing
    }
};

  
  
  // const handleBackImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setBackImage(imageUrl);
  //   }
  // };

  const handleRightImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', new Date().getTime()); // Add timestamp to ensure unique request
  
        // Upload image to MongoDB
        const mongoDbResponse = await fetch('/cardiag/api/upload', {
            method: 'POST',
            body: formData,
        });
        const mongoDbResult = await mongoDbResponse.json();
  
        if (mongoDbResult.fileId) {
            const imageUrl = `/cardiag/api/image/${mongoDbResult.fileId}`;
            const imageBlobResponse = await fetch(imageUrl, { cache: 'no-store' });
            const imageBlob = await imageBlobResponse.blob();
  
            const base64Image = await blobToBase64(imageBlob);
  
            if (base64Image !== "/cardiag/group-10@2x.png") {
                setRightImage(base64Image); // Set the uploaded image for right
  
                const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
                uploadedImages.right = base64Image; // Store original right image
                sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
            }
  
            // Send image to Flask backend for damage detection
            const flaskResponse = await fetch('https://sallai.tech/cardiag/backend/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Cache-Control': 'no-cache' // Prevent backend from caching
                }
            });
  
            const flaskResult = await flaskResponse.json();
  
            // Processed image and damages
            if (flaskResult.modified_image_url) {
                const imageBlobResponse = await fetch(`https://sallai.tech${flaskResult.modified_image_url}`, { cache: 'no-store' });
                const imageBlob = await imageBlobResponse.blob();
                const base64ProcessedImage = await blobToBase64(imageBlob);
  
                setRightImage(base64ProcessedImage); // Update image to the processed version
  
                const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
                uploadedImages.rightProcessed = base64ProcessedImage; // Store processed image
                uploadedImages.rightDamages = flaskResult.damages; // Store detected damages
                sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
  
                setDetectedDamages((prevDamages) => ({
                    ...prevDamages,
                    right: flaskResult.damages, // Store damages for the right
                }));
            }
        }
        resetInput(e);  // Reset the input field after processing
    }
};

  
  
  

  // const handleRightImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setRightImage(imageUrl);
  //   }
  // };

  return (
    <div className={styles.desktop}>
      <main className={styles.mainWrap}>
        <section className={styles.frame}>
          <img className={styles.frameChild} alt="" src="/cardiag/vector-12.svg" />
          <div className={styles.frameParent}>
            <div className={styles.frameGroup}>
              <div className={styles.frameContainer}>
                <div className={styles.subheadingWrapper}>
                  <div className={styles.subheading}>Claim Submission</div>
                </div>
                <h1 className={styles.uploadImages}>Upload Images</h1>
              </div>
              
              
            </div>
             {/* Front view of the car */}
          <div className={styles.groupDiv}>
            <div className={styles.frameWrapper}>
              <div className={styles.frameParent1}>
                <div className={styles.textParent}>
                  <h2 className={styles.text}>Front view of the car</h2>
                  <div className={styles.alertCircleParent}>
                    <img
                      className={styles.alertCircleIcon}
                      alt=""
                      src="/cardiag/alertcircle.svg"
                    />
                    <div className={styles.textWrapper}>
                      <div className={styles.uploadAlert}>
                        This is just some instruction on how to take a picture
                        properly.
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.section}>
                  <div className={styles.fileUploadBase}>
                    <label className={styles.label} htmlFor="file-front-view">
                      <div className={styles.content}>
                        <img
                          className={styles.featuredIcon}
                          loading="lazy"
                          alt=""
                          src="/cardiag/featured-icon.svg"
                        />
                        <div className={styles.textAndSupportingText}>
                          <div className={styles.action}>
                            <div className={styles.button}>
                              <div className={styles.buttonBase}>
                                <div className={styles.text2}>
                                  Click to upload
                                </div>
                              </div>
                            </div>
                            <div className={styles.actionLabel}>
                              or drag and drop
                            </div>
                          </div>
                          <div className={styles.supportingText}>
                            SVG, PNG, JPG or GIF (max. 800x400px)
                          </div>
                        </div>
                      </div>
                    </label>
                    <input
                      className={styles.input}
                      type="file"
                      id="file-front-view"
                      onChange={handleFrontImageUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={frontImage !== "/cardiag/image-20@2x.png" ? styles.uploadedImageContentWrapper : styles.rectangleParent}>
            <div className={styles.frameItem} />
                        <img
              className={frontImage !== "/cardiag/image-20@2x.png" ? styles.uploadedImage : styles.image20Icon}
              loading="lazy"
              alt="Front view of the car"
              src={frontImage}
            />
          
          </div>
          </div>
          </div>
          <img
            className={styles.frameInner}
            loading="lazy"
            alt=""
            src="/cardiag/vector-12.svg"
          />
          <div className={styles.frameDiv}>
            <div className={styles.frameParent2}>
              <div className={styles.frameWrapper1}>
                <div className={styles.frameParent1}>
                  <div className={styles.textParent}>
                    <h2 className={styles.text}>Left view of the car</h2>
                    <div className={styles.alertCircleParent}>
                      <img
                        className={styles.alertCircleIcon}
                        loading="lazy"
                        alt=""
                        src="/cardiag/alertcircle.svg"
                      />
                      <div className={styles.textWrapper}>
                        <div className={styles.uploadAlert}>
                          This is just some instruction on how to take a picture
                          properly.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.section}>
                    <div className={styles.fileUploadBase}>
                      <label className={styles.label} htmlFor="file-left-view">
                        <div className={styles.content}>
                          <img
                            className={styles.featuredIcon}
                            loading="lazy"
                            alt=""
                            src="/cardiag/featured-icon.svg"
                          />
                          <div className={styles.textAndSupportingText}>
                            <div className={styles.action}>
                              <div className={styles.button}>
                                <div className={styles.buttonBase}>
                                  <div className={styles.text2}>
                                    Click to upload
                                  </div>
                                </div>
                              </div>
                              <div className={styles.actionLabel}>
                                or drag and drop
                              </div>
                            </div>
                            <div className={styles.supportingText}>
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </div>
                          </div>
                        </div>
                      </label>
                      <input
                      className={styles.input}
                      type="file"
                      id="file-left-view"
                      onChange={handleLeftImageUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={leftImage !== "/cardiag/image-18@2x.png" ? styles.uploadedImageContentWrapper : styles.rectangleParent}>
            <div className={styles.frameItem} />
            <img
              className={leftImage !== "/cardiag/image-18@2x.png" ? styles.uploadedImage : styles.image18Icon}
              loading="lazy"
              alt="Back view of the car"
              src={leftImage}
            />
          </div>
          </div>
          </div>
          <img
            className={styles.frameInner}
            loading="lazy"
            alt=""
            src="/cardiag/vector-12.svg"
          />
          <div className={styles.frameDiv}>
            <div className={styles.frameParent4}>
              <div className={styles.frameWrapper}>
                <div className={styles.frameParent1}>
                  <div className={styles.textParent}>
                    <h2 className={styles.text}>Back view of the car</h2>
                    <div className={styles.alertCircleParent}>
                      <img
                        className={styles.alertCircleIcon}
                        loading="lazy"
                        alt=""
                        src="/cardiag/alertcircle-2.svg"
                      />
                      <div className={styles.textWrapper}>
                        <div className={styles.uploadAlert}>
                          This is just some instruction on how to take a picture
                          properly.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.section2}>
                    <div className={styles.fileUploadBase}>
                    <label className={styles.label} htmlFor="file-back-view">
                        <div className={styles.content}>
                          <img
                            className={styles.featuredIcon}
                            loading="lazy"
                            alt=""
                            src="/cardiag/featured-icon.svg"
                          />
                          <div className={styles.textAndSupportingText}>
                            <div className={styles.action}>
                              <div className={styles.button}>
                                <div className={styles.buttonBase}>
                                  <div className={styles.text2}>
                                    Click to upload
                                  </div>
                                </div>
                              </div>
                              <div className={styles.actionLabel}>
                                or drag and drop
                              </div>
                            </div>
                            <div className={styles.supportingText}>
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </div>
                          </div>
                        </div>
                      </label>
                      <input
                      className={styles.input}
                      type="file"
                      id="file-back-view"
                      onChange={handleBackImageUpload}
                    />
                    
                  </div>
                </div>
              </div>
            </div>
            <div className={backImage !== "/cardiag/image-17@2x.png" ? styles.uploadedImageContentWrapper : styles.rectangleParent}>
            <div className={styles.frameItem} />
            <img
              className={backImage !== "/cardiag/image-17@2x.png" ? styles.uploadedImage : styles.image17Icon}
              loading="lazy"
              alt="Back view of the car"
              src={backImage}
            />
          </div>
          </div>
           
          </div>
          <img
            className={styles.frameInner}
            loading="lazy"
            alt=""
            src="/cardiag/vector-12.svg"
          />
          <div className={styles.frameParent6}>
            <div className={styles.frameWrapper3}>
              <div className={styles.frameParent7}>
                <div className={styles.frameWrapper1}>
                  <div className={styles.frameParent1}>
                    <div className={styles.textParent}>
                      <h2 className={styles.text}>Right view of the car</h2>
                      <div className={styles.alertCircleParent}>
                        <img
                          className={styles.alertCircleIcon}
                          loading="lazy"
                          alt=""
                          src="/cardiag/alertcircle-2.svg"
                        />
                        <div className={styles.textWrapper}>
                          <div className={styles.uploadAlert}>
                            This is just some instruction on how to take a
                            picture properly.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.section}>
                      <div className={styles.fileUploadBase}>
                        <label className={styles.label} htmlFor="file-right-view">
                          <div className={styles.content}>
                            <img
                              className={styles.featuredIcon}
                              loading="lazy"
                              alt=""
                              src="/cardiag/featured-icon.svg"
                            />
                            <div className={styles.textAndSupportingText}>
                              <div className={styles.action}>
                                <div className={styles.button}>
                                  <div className={styles.buttonBase}>
                                    <div className={styles.text2}>
                                      Click to upload
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.actionLabel}>
                                  or drag and drop
                                </div>
                              </div>
                              <div className={styles.supportingText}>
                                SVG, PNG, JPG or GIF (max. 800x400px)
                              </div>
                            </div>
                          </div>
                        </label>
                        <input
                      className={styles.input}
                      type="file"
                      id="file-right-view"
                      onChange={handleRightImageUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={rightImage !== "/cardiag/group-10@2x.png" ? styles.uploadedImageContentWrapper : styles.rectangleParent}>
            <div className={styles.frameItem} />
            <img
              className={rightImage !== "/cardiag/group-10@2x.png" ? styles.uploadedImage : styles.image18Icon}
              loading="lazy"
              alt="Right view of the car"
              src={rightImage}
            />
          </div>
          </div>
            </div>
            <div className={styles.buttonParent}>
              <div className={styles.button4}>
                <ButtonBase
                  propWidth="unset"
                  propBackgroundColor="#e1e0ee"
                  propBorder="1px solid #f9f5ff"
                  text="Cancel"
                  propWidth1="unset"
                  propColor="#3802d0"
                  propTextDecoration="unset"
                  buttonBaseFlex="1"
                  onClick={() => {
                    router.push('/cardiag/');
                  }}
                />
             </div>
             <div className={styles.button5}>
             <ButtonBase
              text="See loss analysis"
              onClick={() => {
                // Check if any image is different from the default placeholders
                const hasUploadedImages = (
                  frontImage !== "/cardiag/image-20@2x.png" ||
                  leftImage !== "/cardiag/image-18@2x.png" ||
                  backImage !== "/cardiag/image-17@2x.png" ||
                  rightImage !== "/cardiag/group-10@2x.png"
                );

                if (hasUploadedImages) {
                  // Allow navigation if images are uploaded
                  router.push('/DmgAssist');
                } else {
                  // Show an alert if no images are uploaded
                  alert("Please upload images before proceeding to the loss analysis.");
                }
              }}
            />
          </div>
    </div>
          </div>
        </section>
        <div className={styles.nav}>
          <div className={styles.header}>
            <div className={styles.logomark}>
              <img
                className={styles.contentIcon}
                loading="lazy"
                alt=""
                src="/cardiag/content.svg"
              />
            </div>
          </div>
          <div className={styles.navigation}>
            <div className={styles.navItemButton}>
              <img
                className={styles.homeIcon}
                loading="lazy"
                alt=""
                src="/cardiag/home.svg"
              />
            </div>
            <div className={styles.navItemButton}>
              <img
                className={styles.homeIcon}
                loading="lazy"
                alt=""
                src="/cardiag/barchart2.svg"
              />
            </div>
            <div className={styles.navItemButton}>
              <img
                className={styles.homeIcon}
                loading="lazy"
                alt=""
                src="/cardiag/3layers.svg"
              />
            </div>
            <div className={styles.navItemButton}>
              <img
                className={styles.homeIcon}
                loading="lazy"
                alt=""
                src="/cardiag/checksquare.svg"
              />
            </div>
            <div className={styles.navItemButton}>
              <img
                className={styles.homeIcon}
                loading="lazy"
                alt=""
                src="/cardiag/flag.svg"
              />
            </div>
            <div className={styles.navItemButton}>
              <img
                className={styles.homeIcon}
                loading="lazy"
                alt=""
                src="/cardiag/users.svg"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Desktop;
