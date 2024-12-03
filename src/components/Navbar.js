import { useState } from 'react';
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
        <Link href="/"> {/* Página Inicial */}
          <a>Início</a>
        </Link>
        <Link href="/Data"> {/* Página de Dados */}
          <a>Dados</a>
        </Link>
        <Link href="/Alerts"> {/* Página de Alertas */}
          <a>Alertas</a>
        </Link>
        <Link href="/Settings"> {/* Página de Configurações */}
          <a>Configurações</a>
        </Link>
        <Link href="/Profile"> {/* Página de Perfil */}
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
