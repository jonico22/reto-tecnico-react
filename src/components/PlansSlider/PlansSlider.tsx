import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; 
import { Plan, QuoteTarget } from '../../store/RegisterSlice'; 
import PlanCard from '../PlanCard/PlanCard'; 
import BackIcon from '../../assets/images/Icon-button.svg'; 
import NextIcon from '../../assets/images/icon-next.svg'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './PlansSlider.module.css';
interface PlansSliderProps {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  quoteTarget: QuoteTarget;
}

const PlansSlider: React.FC<PlansSliderProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  quoteTarget,
}) => {
  if (!plans || plans.length === 0) {
    return null; 
  }

  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Navigation, Pagination]} 
        spaceBetween={16} 
        slidesPerView={1.15} 
        centeredSlides={false} 
        initialSlide={0} 
        pagination={{
          clickable: true,
          el: `.${styles.customPagination}`, 
          type: 'custom', 
          renderCustom: function (swiper, current, total) {
            return `<span class="${styles.paginationText}">${current} / ${total}</span>`;
          }
        }}
        navigation={{ 
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
          disabledClass: styles.swiperButtonDisabled, 
        }}
        breakpoints={{ 
          480: { 
            slidesPerView: 1.35,
            spaceBetween: 20,
          },
          640: {
             slidesPerView: 1.75, 
             spaceBetween: 20,
          }
        }}
        className={styles.mySwiper} 
      >
        {plans.map((plan) => (
          <SwiperSlide key={plan.id} className={styles.swiperSlide}>
            <PlanCard
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              onSelectPlan={onSelectPlan}
              quoteTarget={quoteTarget}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.navigationControls}>
        <button className={`${styles.swiperButtonPrev} ${styles.navButton}`} aria-label="Plan anterior">
          < img src={BackIcon} alt="Volver" className={styles.backIcon} />
        </button>
        <div className={styles.customPagination}></div> 
        <button className={`${styles.swiperButtonNext} ${styles.navButton}`} aria-label="Siguiente plan">
          < img src={NextIcon} alt="Volver" className={styles.backIcon} />
        </button>
      </div>
    </div>
  );
};

export default PlansSlider;