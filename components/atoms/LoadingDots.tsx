import React from 'react';
import styles from '../../styles/components/LoadingDots.module.scss';

const LoadingDots = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default LoadingDots;