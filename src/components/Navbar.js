// src/components/Navbar.js

import Link from 'next/link'
import styles from '../styles/Navbar.module.css'

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <h2>Painel de Controle</h2>
      </div>
      <div className={styles.menu}>
        <Link href="/">Home</Link>
        <Link href="/profile">Perfil</Link>
        <Link href="/settings">Configurações</Link>
      </div>
    </nav>
  )
}

export default Navbar
