import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Dashboard</h1>
      <div className={styles.userInfo}>
        <span>Olá, Usuário</span>
      </div>
    </header>
  );
};

export default Header;
