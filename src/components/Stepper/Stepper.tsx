import React from 'react';
import styles from './Stepper.module.css';

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  currentStepNumber: number;
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ currentStepNumber, steps }) => {
  return (
    <nav className={styles.stepper}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`${styles.step} ${
              step.number === currentStepNumber ? styles.active : ''
            } ${step.number < currentStepNumber ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>{step.number}</div>
            <div className={styles.stepLabel}>{step.label}</div>
          </div>
          {index < steps.length - 1 && <div className={styles.connector}></div>}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Stepper;