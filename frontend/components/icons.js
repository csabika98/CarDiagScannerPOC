import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./icons.module.css";

const Icons = ({ className = "", icons, propHeight, propWidth }) => {
  const iconsStyle = useMemo(() => {
    return {
      height: propHeight,
      width: propWidth,
    };
  }, [propHeight, propWidth]);

  return (
    <img
      className={[styles.icons, className].join(" ")}
      alt=""
      src={icons}
      style={iconsStyle}
    />
  );
};

Icons.propTypes = {
  className: PropTypes.string,
  icons: PropTypes.string,

  /** Style props */
  propHeight: PropTypes.any,
  propWidth: PropTypes.any,
};

export default Icons;
