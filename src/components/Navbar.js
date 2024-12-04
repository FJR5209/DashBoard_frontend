import { useState } from 'react';
import { useRouter } from 'next/router'; // Importando o hook useRouter do Next.js
import Link from 'next/link';
import navbarStyles from '../styles/Navbar.module.css'; // Importando os estilos da Navbar

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar o menu
  const router = useRouter(); // Hook para redirecionar após logout

  // Função para alternar a visibilidade do menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Função para fazer o logout
  const handleLogout = () => {
    // Remover o token do localStorage ou sessionStorage
    localStorage.removeItem('authToken');  // Se estiver usando localStorage
    sessionStorage.removeItem('authToken');  // Se estiver usando sessionStorage
    
    // Se estiver usando cookies, remova o cookie de autenticação
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Exemplo de remoção de cookie
    
    // Redirecionar para a página de login
    router.push('/login');
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

      {/* Botão de logout */}
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
