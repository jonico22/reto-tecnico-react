import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  RootState } from '../../store/store';
import {  Plan } from '../../store/RegisterSlice';
import Stepper from '../../components/Stepper/Stepper';
import styles from './QuoteSummaryPage.module.css';
import UserGroupIcon from '../../assets/images/gl_family-24x24.svg'; 
import BackArrowIcon from '../../assets/images/Icon-button.svg'; 

const desktopSteps = [
  { number: 1, label: 'Planes y coberturas' },
  { number: 2, label: 'Resumen' },
];

const QuoteSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    finalSubmittedQuoteData, 
    userServiceResponse,    
    selectedPlanId,
    availablePlans,
    quoteForWhom,
  } = useSelector((state: RootState) => state.register);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedPlan: Plan | undefined = availablePlans.find(plan => plan.id === selectedPlanId);

  const personName = userServiceResponse?.name || 
                     userServiceResponse?.lastName ||
                     `${finalSubmittedQuoteData?.documentType?.toUpperCase() || ''} ${finalSubmittedQuoteData?.documentNumber || ''}` || 
                     'Usuario';

  let finalPlanCost = selectedPlan?.price;
  if (selectedPlan && quoteForWhom === 'someoneElse') {
    finalPlanCost = parseFloat((selectedPlan.price * 0.95).toFixed(2));
  }

  if (!selectedPlanId || !selectedPlan) {
    console.warn("Redirigiendo: falta información para el resumen.");
    return <Navigate to="/" replace />;
  }

  const handleGoBack = () => {
    navigate('/planes'); 
  };



  return (
    <div className={styles.summaryPageWrapper}>
      {!isMobileView && (
        <Stepper currentStepNumber={2} steps={desktopSteps} />
      )}

      <div className={`${styles.contentArea} container`}>
        <button onClick={handleGoBack} className={styles.desktopBackButton}>
          <img src={BackArrowIcon} alt="Volver" className={styles.backIcon} />
          Volver
        </button>

        <h1 className={styles.mainTitle}>Resumen del seguro</h1> 

        <div className={styles.summaryCard}>
          <div className={styles.cardSection}>
            <p className={styles.sectionLabel}>PRECIOS CALCULADOS PARA:</p>
            <div className={styles.personInfo}>
              <img src={UserGroupIcon} alt="Volver" className={styles.personIcon} />
              <span className={styles.personName}>{personName}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.cardSection}>
            <h3 className={styles.sectionTitle}>Responsable de pago</h3>
            <p className={styles.detailItem}>
              <span className={styles.detailLabel}>DNI:</span> {finalSubmittedQuoteData?.documentNumber}
            </p>
            <p className={styles.detailItem}>
              <span className={styles.detailLabel}>Celular:</span> {finalSubmittedQuoteData?.cellphone}
            </p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.cardSection}>
            <h3 className={styles.sectionTitle}>Plan elegido</h3>
            <p className={styles.detailItem}>{selectedPlan.name}</p>
            <p className={styles.detailItem}>
              <span className={styles.detailLabel}>Costo del Plan:</span> {selectedPlan.currency}{finalPlanCost?.toFixed(2)} al mes
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuoteSummaryPage;