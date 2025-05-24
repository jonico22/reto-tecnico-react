import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { setQuoteForWhom, QuoteTarget,fetchAvailablePlans, 
  setSelectedPlanId } from '../../store/RegisterSlice';
import Stepper from '../../components/Stepper/Stepper';
import ProgressBarStepper from '../../components/ProgressBarStepper/ProgressBarStepper';
import SelectionCard from '../../components/SelectionCard/SelectionCard';
import PlanCard from '../../components/PlanCard/PlanCard'; 
import Button from '../../components/Button/Button'; 
import styles from './PlansPage.module.css';
import UserIcon from '../../assets/images/IcAddUserLight.svg'; 
import UsersIcon from '../../assets/images/IcProtectionLight.svg'; 
import BackIcon from '../../assets/images/Icon-button.svg'; 

const desktopSteps = [
  { number: 1, label: 'Planes y coberturas' },
  { number: 2, label: 'Resumen' },
];

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
    <path d="M8 12.3636L10.8182 15L16 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

   const {
    quoteForWhom,
    userServiceResponse,
    availablePlans,
    isLoadingPlans,
    plansError,
    selectedPlanId,
  } = useSelector((state: RootState) => state.register);
  const userName = userServiceResponse?.name || 'Usuario';
  const userDatebirth = userServiceResponse?.birthDay || 'Fecha de nacimiento no disponible';
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const handleGoBack = () => {
    navigate(-1); 
  };

   useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadPlans = useCallback(() => {
    if (quoteForWhom) {
      dispatch(fetchAvailablePlans({ target: quoteForWhom, dateBrithday: userDatebirth }));
    }
  }, [dispatch, quoteForWhom,userDatebirth]);



  const handleTargetSelection = (value: string) => {
    const newTarget = value as QuoteTarget;
    if (newTarget !== quoteForWhom) {
      dispatch(setQuoteForWhom(newTarget));
      loadPlans();
    }
  };

  const handlePlanSelection = (planId: string) => {
    dispatch(setSelectedPlanId(planId));
    navigate('/resumen');
  };

  const renderPlansContent = () => {
    if (isLoadingPlans) return <p className={styles.loadingMessage}>Cargando planes...</p>;
    if (plansError) return <p className={styles.errorMessageApi}>{plansError}</p>;
    if (!isLoadingPlans && !plansError && availablePlans.length === 0 && quoteForWhom) {
      return <p>No hay planes disponibles para la selección actual.</p>;
    }
    if (availablePlans.length > 0) {
      
        return (
          <div className={styles.planCardsContainer}>
            {availablePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelectPlan={handlePlanSelection}
                quoteTarget={quoteForWhom}
              />
            ))}
          </div>
        );

    }
    return null;
  };
useEffect(() => {
    loadPlans();
  }, [loadPlans]);


  return (
    <div className={styles.plansPageWrapper}>
       {isMobileView ? (
        <ProgressBarStepper currentStep={1} totalSteps={2} />
      ) : (
        <Stepper currentStepNumber={1} steps={desktopSteps} />
      )}

      <div className={`${styles.contentArea} container`}>
         {!isMobileView && ( 
             <Button onClick={handleGoBack} variant="secondary" className={styles.backButton}>
                <img src={BackIcon} alt="Volver" className={styles.backIcon} />
                Volver
            </Button>
        )}

        <h1 className={styles.mainTitle}>
          {userName}, ¿Para quién deseas cotizar?
        </h1>
        <p className={styles.subtitle}>
          Selecciona la opción que se ajuste más a tus necesidades.
        </p>

        <div className={styles.cardsContainer}>
          <SelectionCard
            icon={<img src={UserIcon}  className={styles.backIcon} />}
            title="Para mí"
            description="Cotiza tu seguro de salud y agrega familiares si así lo deseas."
            value="me"
            isSelected={quoteForWhom === 'me'}
            onSelect={handleTargetSelection}
            customRadioElement={quoteForWhom === 'me' ? <CheckIcon /> : undefined}
          />
          <SelectionCard
            icon={<img src={UsersIcon}  className={styles.backIcon} />}
            title="Para alguien más"
            description="Realiza una cotización para uno de tus familiares o cualquier persona."
            value="someoneElse"
            isSelected={quoteForWhom === 'someoneElse'}
            onSelect={handleTargetSelection}
            customRadioElement={quoteForWhom === 'someoneElse' ? <CheckIcon /> : undefined}
          />
        </div>
         {quoteForWhom && (
          <div className={styles.plansDisplaySection}>
            {!isMobileView && !isLoadingPlans && !plansError && availablePlans.length > 0 && (
                 <h2 className={styles.plansTitle}>Elige el plan que mejor se adapte a ti</h2>
            )}
            {renderPlansContent()}
          </div>
        )}
    </div>
    </div>
  );
};

export default PlansPage;