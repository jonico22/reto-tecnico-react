import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import RimacLogo from '../../assets/images/Logo.png';
import PhoneIcon from '../../assets/images/GlTelephoneSolid.svg';

const Header: React.FC = () => {
  return (
    <header className={styles.siteHeader}>
      <div className="container"> 
        <div className='row align-items-center'>
          <div className='col-auto'>
            <Link to="/">
              <img src={RimacLogo} alt="RIMAC Seguros Logo" className={styles.logo} />
            </Link>
          </div>
          
          <div className={"col text-end"}>
            <div className={styles.contactInfo}>
                <span className={styles.desktopOnlyText}>¡Compra por este medio!</span>
                <a href="tel:014116001" className={styles.phoneNumber}>
                  <img src={PhoneIcon} alt="Phone" className={styles.phoneIcon} />
                  (01) 411 6001
                </a>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;