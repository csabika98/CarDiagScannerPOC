import Icons from "./icons";
import PropTypes from "prop-types";
import styles from "./inputs.module.css";

const Inputs = ({ className = "", propHeight, propWidth }) => {
  return (
    <div className={[styles.inputs, className].join(" ")}>
      <Icons
        icons="/cardiag/icons-1.svg"
        propHeight={propHeight}
        propWidth={propWidth}
      />
      <a className={styles.typeSomething} />
    </div>
  );
};

Inputs.propTypes = {
  className: PropTypes.string,
  propHeight: PropTypes.string,
  propWidth: PropTypes.string,
};

export default Inputs;
