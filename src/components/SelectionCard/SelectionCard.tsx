import React from 'react';
import styles from './SelectionCard.module.css';

interface SelectionCardProps {
  icon: React.ReactNode; 
  title: string;
  description: string;
  value: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  customRadioElement?: React.ReactNode; 
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  icon,
  title,
  description,
  value,
  isSelected,
  onSelect,
  customRadioElement, 
}) => {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(value)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
    >
      <div className={styles.radioIndicatorWrapper}> 
        {customRadioElement ? customRadioElement : ( 
          <div className={styles.radioCircle}>
            {isSelected && <div className={styles.radioInnerCircle}></div>}
          </div>
        )}
      </div>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default SelectionCard;