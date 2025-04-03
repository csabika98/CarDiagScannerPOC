import PropTypes from "prop-types";
import styles from "./top-bar-items.module.css";

const TopBarItems = ({ className = "" }) => {
  return (
    <div className={[styles.topBarItems, className].join(" ")}>
      <div className={styles.menuinactivenoNotification}>
        <img
          className={styles.icons}
          loading="lazy"
          alt=""
          src="/cardiag/icons-4.svg"
        />
      </div>
      <div className={styles.notificationIcon} />
    </div>
  );
};

TopBarItems.propTypes = {
  className: PropTypes.string,
};

export default TopBarItems;
