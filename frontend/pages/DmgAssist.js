import Logomark from "../components/logomark";
import ReportTime from "../components/report-time";
import GeneralInfoContainer from "../components/general-info-container";
import GroupComponent1 from "../components/group-component1";
import styles from "./DmgAssist.module.css";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Desktop = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run this validation check on the client-side
    if (typeof window !== 'undefined') {
      // Retrieve uploaded images from sessionStorage
      const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || {};
  
      // Default placeholders
      const defaultImages = {
        front: "/cardiag/image-20@2x.png",
        left: "/cardiag/image-18@2x.png",
        back: "/cardiag/image-17@2x.png",
        right: "/cardiag/group-10@2x.png",
      };
  
      // Determine which images are uploaded
      const isFrontUploaded = uploadedImages.front && uploadedImages.front !== defaultImages.front;
      const isLeftUploaded = uploadedImages.left && uploadedImages.left !== defaultImages.left;
      const isBackUploaded = uploadedImages.back && uploadedImages.back !== defaultImages.back;
      const isRightUploaded = uploadedImages.right && uploadedImages.right !== defaultImages.right;
  
      // Check if all images are still the default images (existing validation)
      const noImagesUploaded = (
        (!uploadedImages.front || uploadedImages.front === defaultImages.front) &&
        (!uploadedImages.left || uploadedImages.left === defaultImages.left) &&
        (!uploadedImages.back || uploadedImages.back === defaultImages.back) &&
        (!uploadedImages.right || uploadedImages.right === defaultImages.right)
      );
  
      // Validation logic for ordered combination
      const isValidOrder = (() => {
        // Check in the required order:
        // 1. Front and Left
        // 2. Front, Left, and Back
        // 3. Front, Left, Back, and Right
        if (isFrontUploaded && !isLeftUploaded && !isBackUploaded && !isRightUploaded) {
          return true; // Only Front uploaded (valid step 1)
        }
  
        if (isFrontUploaded && isLeftUploaded && !isBackUploaded && !isRightUploaded) {
          return true; // Front and Left uploaded (valid step 2)
        }
  
        if (isFrontUploaded && isLeftUploaded && isBackUploaded && !isRightUploaded) {
          return true; // Front, Left, and Back uploaded (valid step 3)
        }
  
        if (isFrontUploaded && isLeftUploaded && isBackUploaded && isRightUploaded) {
          return true; // All uploaded in the correct order
        }
  
        // Any other combinations are not valid
        return false;
      })();
  
      // If no images are uploaded, handle existing validation first
      if (noImagesUploaded) {
        alert("Please upload images before proceeding to the loss analysis.");
        router.push('/cardiag/'); // Redirect to the homepage or the upload page
      } 
      // If images are uploaded but not in the correct order, check order validation
      else if (!isValidOrder) {
        alert("Please ensure you are uploading images in the correct order: Front, Left, Back, Right.");
        router.push('/cardiag/'); // Redirect to the homepage or the upload page
      } 
      // If all validations pass, allow rendering
      else {
        setLoading(false);
      }
    }
  }, [router]);

  // Only render the page if not loading
  if (loading) {
    return null; // Prevent any rendering until validation is complete
  }
  return (
    <div className={styles.desktop}>
      <div className={styles.nav}>
        <div className={styles.header}>
          <Logomark />
        </div>
        <div className={styles.navigation}>
          <button className={styles.navItemButton}>
            <img
              className={styles.homeIcon}
              loading="lazy"
              alt=""
              src="/cardiag/home.svg"
            />
          </button>
          <button className={styles.navItemButton}>
            <img
              className={styles.homeIcon}
              loading="lazy"
              alt=""
              src="/cardiag/barchart2.svg"
            />
          </button>
          <button className={styles.navItemButton}>
            <img
              className={styles.homeIcon}
              loading="lazy"
              alt=""
              src="/cardiag/3layers.svg"
            />
          </button>
          <button className={styles.navItemButton}>
            <img
              className={styles.homeIcon}
              loading="lazy"
              alt=""
              src="/cardiag/checksquare.svg"
            />
          </button>
          <button className={styles.navItemButton}>
            <img
              className={styles.homeIcon}
              loading="lazy"
              alt=""
              src="/cardiag/flag.svg"
            />
          </button>
          <button className={styles.navItemButton}>
            <img
              className={styles.homeIcon}
              loading="lazy"
              alt=""
              src="/cardiag/users.svg"
            />
          </button>
        </div>
      </div>
      <main className={styles.reportTimeParent}>
        <ReportTime />
        <GeneralInfoContainer />
        <GroupComponent1 />
        <h1 className={styles.damageDetails}>Damage Details</h1>
        <div className={styles.diagramItems}>
          <button className={styles.diagramParts}>
            <div className={styles.carOverview}>Car overview</div>
            <div className={styles.ellipseParent}>
          
            </div>
          </button>
          <button className={styles.diagramParts1} onClick={() => window.location.href = '/cardiag/Front'}>
          <div className={styles.carOverview}>Front</div>
          <div className={styles.ellipseParent}>
          </div>
        </button>
        
          <button className={styles.diagramParts1}>
            <div className={styles.carOverview}>Back</div>
            <div className={styles.ellipseParent}>
             
            </div>
          </button>
          <button className={styles.diagramParts1}>
            <div className={styles.carOverview}>Hood</div>
            <div className={styles.ellipseParent}>
           
            </div>
          </button>
          <button className={styles.diagramParts4}>
            <div className={styles.carOverview}>Grill</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Wing mirror</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Left front wheel</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Hub cap (left front)</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Right front wheel</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Left back wheel</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Right back wheel</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Left front door</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Left front door post</div>
          </button>
          <button className={styles.diagramParts5}>
            <div className={styles.carOverview}>Right front door handle</div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Desktop;
