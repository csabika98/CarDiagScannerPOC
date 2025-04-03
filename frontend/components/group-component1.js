import Inputs from "./inputs";
import Icons from "./icons";
import TopBarItems from "./top-bar-items";
import PropTypes from "prop-types";
import styles from "./group-component1.module.css";

const GroupComponent1 = ({ className = "" }) => {
  return (
    <section className={[styles.costLabelsParent, className].join(" ")}>
      <div className={styles.costLabels}>
        <div className={styles.costDetails}>
          <div className={styles.estimatedTotalCost}>Estimated total cost</div>
          <a className={styles.parts} />
        </div>
      </div>
      <div className={styles.costLabels1}>
        <div className={styles.costDetails}>
          <div className={styles.estimatedTotalCost}>Repair</div>
          <a className={styles.parts} />
        </div>
      </div>
      <div className={styles.costLabels2}>
        <div className={styles.costDetails}>
        <div className={styles.estimatedTotalCost}>Replace</div>
          <a className={styles.parts} />
        </div>
      </div>
      <header className={styles.topBar}>
        <div className={styles.topbarContent}>
          <div className={styles.topBarItems}>
            <img
              className={styles.icons}
              loading="lazy"
              alt=""
              src="/cardiag/icons.svg"
            />
          </div>
          <Inputs propHeight="20px" propWidth="20px" />
        </div>
        <div className={styles.topbarMenu}>
          <div className={styles.selectLanguage}>
            <div className={styles.flagsgbParent}>
              <img className={styles.flagsgbIcon} alt="" src="/cardiag/flagsgb.svg" />
              <div className={styles.english}>English</div>
            </div>
            <Icons icons="/cardiag/icons-2.svg" />
          </div>
          <div className={styles.topBarItems1}>
            <img
              className={styles.icons}
              loading="lazy"
              alt=""
              src="/cardiag/icons-3.svg"
            />
          </div>
          <TopBarItems />
          <img
            className={styles.switchIcon}
            loading="lazy"
            alt=""
            src="/cardiag/switch@2x.png"
          />
          <img
            className={styles.userPicIcon}
            loading="lazy"
            alt=""
            src="/cardiag/user-pic.svg"
          />
        </div>
      </header>
    </section>
  );
};

GroupComponent1.propTypes = {
  className: PropTypes.string,
};

export default GroupComponent1;
