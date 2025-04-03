import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./group-component.module.css";

const GroupComponent = ({
  className = "",
  propTop,
  group50,
  processedImage,
  side,
  onClick,
  style = {}
}) => {
  const groupDivStyle = useMemo(() => {
    return {
      top: propTop,
      ...style, // Merge custom styles with existing styles
    };
  }, [propTop, style]);

  return (
    <div
      className={[styles.groupParent, className].join(" ")}
      style={groupDivStyle}
    >
      {/* Display group50 image (existing functionality) */}
      {group50 && (
        <img className={styles.groupChild} alt="Group Image" src={group50} />
      )}

      {/* Display processed image or fallback if not available */}
      {processedImage ? (
        <div
          className={styles.imageWrapper}
          onClick={() => onClick && onClick(side)}
          style={{ cursor: "pointer" }}
        >
          <img
            className={styles.groupChild}
            alt="Processed Image"
            src={processedImage}
            style={{ borderRadius: "30%" }}
          />
        </div>
      ) : (
        <div className={styles.placeholder}>No Image Available</div>
      )}
    </div>
  );
};

GroupComponent.propTypes = {
  className: PropTypes.string,
  group50: PropTypes.string, // Ensure group50 is still passed as a string (URL to image)
  processedImage: PropTypes.string, // New prop for the processed image
  side: PropTypes.string, // New prop for the car side (front, left, right, back)
  onClick: PropTypes.func, // New prop for handling the click (modal open)

  /** Style props */
  propTop: PropTypes.any,
  style: PropTypes.object, // Add the style prop
};

export default GroupComponent;




