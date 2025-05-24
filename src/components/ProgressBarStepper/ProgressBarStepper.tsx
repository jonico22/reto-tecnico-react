import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProgressBarStepper.module.css';
import BackArrowIcon from '../../assets/images/Icon-button.svg'; 

interface ProgressBarStepperProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBarStepper: React.FC<ProgressBarStepperProps> = ({ currentStep, totalSteps }) => {
  const navigate = useNavigate();
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.stepperContainer}>
      <button onClick={handleGoBack} className={styles.backButton} aria-label="Volver">
        <img src={BackArrowIcon} alt="Volver" className={styles.backIcon} />
      </button>
      <div className={styles.progressInfo}>
        <span className={styles.stepText}>
          PASO {currentStep} DE {totalSteps}
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarStepper;