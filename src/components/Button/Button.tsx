import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
  className={`${styles.btn} ${styles[`btn-${variant}`]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
  {...props}
>
  {children}
</button>
  );
};

export default Button;