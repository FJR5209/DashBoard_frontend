import React from 'react';
import styles from './Sidebar.module.css';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/users">Usuários</Link></li>
          <li><Link href="/settings">Configurações</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
