import PropTypes from "prop-types";
import styles from "./logomark.module.css";

const Logomark = ({ className = "" }) => {
  return (
    <div className={[styles.logomark, className].join(" ")}>
      <img
        className={styles.contentIcon}
        loading="lazy"
        alt=""
        src="/cardiag/content.svg"
      />
    </div>
  );
};

Logomark.propTypes = {
  className: PropTypes.string,
};

export default Logomark;
