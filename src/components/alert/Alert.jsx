import React, { useEffect, useState } from 'react';
import styles from './Alert.module.css';
import { RxCross2 } from "react-icons/rx";
import { IoWarningOutline } from "react-icons/io5";
import { SiTicktick } from "react-icons/si";

export default function Alert({
  message,
  variant = 'success',
  setIsInitialRender
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);

      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        if (setIsInitialRender) {
          setIsInitialRender(false);
        }
      }, 300);

      return () => clearTimeout(exitTimer);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  if (variant === 'success') {
    return (
      <div
        className={`${styles.alert} ${styles["alert-success"]} ${isExiting ? styles.alertExit : ''}`}
      >
        <div className={styles["alert-content"]}>
          <SiTicktick />
          {message}
        </div>
      </div>
    );
  } else if (variant === 'warning') {
    return (
      <div
        className={`${styles.alert} ${styles["alert-warning"]} ${isExiting ? styles.alertExit : ''}`}
      >
        <div className={styles["alert-content"]}>
          <IoWarningOutline />
          {message}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.alert} ${styles["alert-danger"]} ${isExiting ? styles.alertExit : ''}`}
      >
        <div className={styles["alert-content"]}>
          <RxCross2 />
          {message}
        </div>
      </div>
    );
  }

};