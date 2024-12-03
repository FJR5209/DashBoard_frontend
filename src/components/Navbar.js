import { useState } from 'react';
import Link from 'next/link'; // Importando o Link do Next.js
import navbarStyles from '../styles/Navbar.module.css'; // Importando os estilos da Navbar

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar o menu

  // Função para alternar a visibilidade do menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={navbarStyles.navbar}>
      <h1>Painel de Controle</h1>

      {/* Links de navegação */}
      <div className={`${navbarStyles['nav-links']} ${menuOpen ? navbarStyles.active : ''}`}>
        <Link href="/">
          <a>Início</a>
        </Link>
        <Link href="/Data">
          <a>Dados</a>
        </Link>
        <Link href="/Alerts">
          <a>Alertas</a>
        </Link>
        <Link href="/Settings">
          <a>Configurações</a>
        </Link>
        <Link href="/Profile">
          <a>Perfil</a>
        </Link>
      </div>

      {/* Ícone do menu */}
      <div className={navbarStyles['menu-icon']} onClick={toggleMenu}>
        &#9776; {/* Ícone do menu hambúrguer */}
      </div>
    </div>
  );
}
