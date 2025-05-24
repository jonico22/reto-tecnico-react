import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import RimacLogo from '../../assets/images/logo-white.png';

const Footer: React.FC = () => {
  return (
    <footer className={styles.siteFooter}>
            <div className="container">
                <div className={`${styles.siteFooter} row  align-items-center `}>
                    <div className={`${styles.footerLogoWrapper}  col-md-4 col-12 `}>
                        <Link to="/" className={styles.logoLink}>
                        <img src={RimacLogo} alt="RIMAC Seguros Logo" className={styles.logo} />
                    </Link>
                    </div>
                    <div className={`${styles.footerCopyrightWrapper} col-md-8 col-12 text-end`}>
                        <p className={`${styles.copyright} `}>© 2023 RIMAC Seguros y Reaseguros.</p>
                    </div>
                </div>
            </div>
        </footer>
  );
};
export default Footer;