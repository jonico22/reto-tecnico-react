import React from 'react';
import RegisterFormComponent from '../../features/register/components/RegisterForm';
import styles from './HomePage.module.css';
import familyImageDesktop from '../../assets/images/image_desktop.webp';

const HomePage: React.FC = () => {
  return (
    <section className={`${styles.heroSection} container`}> 
      <div className="row align-items-center"> 
        <div className={`col-lg-6 ${styles.heroImageDesktopWrapper}`}>
          <img
            src={familyImageDesktop}
            alt="Familia feliz"
            className={styles.heroImageDesktop}
          />
        </div>
        <div className={`col-lg-6 ${styles.heroFormColumn}`}>
          <img src={familyImageDesktop} alt="" className={styles.heroImageMobile} height={193}/>
          <span className={styles.tag}>Seguro Salud Flexible</span>
          <h1>Creado para ti y tu familia</h1>
          <p className={styles.subheadline}>
            Tú eliges cuánto pagar. Ingresa tus datos, cotiza y recibe nuestra asesoría. 100% online.
          </p>
           <RegisterFormComponent />
        </div>
      </div>
    </section>
  );
};
export default HomePage;