import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./button-base.module.css";

const ButtonBase = ({
  className = "",
  propWidth,
  propBackgroundColor,
  propBorder,
  text,
  propWidth1,
  propColor,
  propTextDecoration,
  buttonBaseFlex,
  onClick,  // Add onClick prop
}) => {
  const buttonBaseStyle = useMemo(() => {
    return {
      width: propWidth,
      backgroundColor: propBackgroundColor,
      border: propBorder,
      flex: buttonBaseFlex,
    };
  }, [propWidth, propBackgroundColor, propBorder, buttonBaseFlex]);

  const textStyle = useMemo(() => {
    return {
      width: propWidth1,
      color: propColor,
      textDecoration: propTextDecoration,
    };
  }, [propWidth1, propColor, propTextDecoration]);

  return (
    <button
      className={[styles.buttonBase, className].join(" ")}
      style={buttonBaseStyle}
      onClick={onClick}  // Pass onClick to the button element
    >
      <div className={styles.text} style={textStyle}>
        {text}
      </div>
    </button>
  );
};

ButtonBase.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,

  /** Style props */
  propWidth: PropTypes.any,
  propBackgroundColor: PropTypes.any,
  propBorder: PropTypes.any,
  propWidth1: PropTypes.any,
  propColor: PropTypes.any,
  propTextDecoration: PropTypes.any,
  buttonBaseFlex: PropTypes.any,
  onClick: PropTypes.func,  // Add onClick to prop types
};

export default ButtonBase;

