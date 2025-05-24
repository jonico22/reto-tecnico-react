
import React from 'react';
import { Plan ,QuoteTarget} from '../../store/RegisterSlice'; 
import Button from '../Button/Button';
import styles from './PlanCard.module.css';
import DefaultPlanIcon from '../../assets/images/IcHomeLight.svg';

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelectPlan: (planId: string) => void;
  quoteTarget: QuoteTarget;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelectPlan,quoteTarget }) => {
  const IconComponent = plan.iconUrl ? (
    <img src={plan.iconUrl} alt={`${plan.name} icon`} className={styles.planIcon} />
  ) : (
    <img src={DefaultPlanIcon} alt="Volver" className={styles.planIcon} />
  );
  let displayCost = plan.price;
  let originalCost = null;

  if (quoteTarget === 'someoneElse') {
    originalCost = plan.price;
    displayCost = parseFloat((plan.price * 0.95).toFixed(2)); 
  }

  return (
    <div className={`${styles.planCard} ${isSelected ? styles.selected : ''} ${plan.isRecommended ? styles.recommended : ''}`}>
      {plan.isRecommended && <div className={styles.recommendedBadge}>Plan recomendado</div>}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.planName}>{plan.name}</h3>
          <p className={styles.costLabel}>COSTO DEL PLAN</p>
          {originalCost !== null && originalCost !== displayCost && (
            <p className={styles.originalCost}>{plan.currency ?? '$'}{originalCost.toFixed(2)} antes</p>
          )}
          <p className={styles.planCost}>{plan.currency ?? '$'}{displayCost.toFixed(2)} al mes</p>
        </div>
        <div className={styles.iconWrapper}>
          {IconComponent}
        </div>
      </div>
      <hr className={styles.divider} />
      <ul className={styles.featuresList}>
        {plan.description.map((feature, index) => (
          <li key={index} className={styles.featureItem}>{feature}</li>
        ))}
      </ul>
      <Button
        onClick={() => onSelectPlan(plan.id)}
        variant={isSelected ? 'secondary' : 'primary'} 
        className={styles.selectButton}
      >
        {isSelected ? 'Plan Seleccionado' : 'Seleccionar Plan'}
      </Button>
    </div>
  );
};

export default PlanCard;