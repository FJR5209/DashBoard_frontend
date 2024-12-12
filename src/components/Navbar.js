import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importando o hook useRouter do Next.js
import Link from 'next/link';
import navbarStyles from '../styles/Navbar.module.css'; // Importando os estilos da Navbar

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar o menu
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin
  const router = useRouter(); // Hook para redirecionar após logout

  useEffect(() => {
    // Verifique o papel do usuário a partir do token ou contexto de autenticação
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      try {
        // // Log do token para verificar se está sendo armazenado corretamente
        // console.log("Token encontrado:", token);

        // // Decodificando o token JWT
        // const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando o token (exemplo de JWT)
        
        // // Log para verificar a estrutura do token decodificado
        // console.log("Token decodificado:", decodedToken);

        // Verificando se o papel é admin
        if (decodedToken.user && decodedToken.user.role === 'admin') {
          setIsAdmin(true); // Se o papel for admin, altere o estado
        } else {
          console.log("O papel do usuário não é admin. Papel encontrado:", decodedToken.user ? decodedToken.user.role : 'não encontrado');
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    } else {
      console.log("Token não encontrado no armazenamento.");
    }
  }, []); // Dependências vazias para rodar uma vez após a renderização

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
        <Link href="/Alerts">
          <a>Alertas</a>
        </Link>
        <Link href="/Profile">
          <a>Perfil</a>
        </Link>

        {/* Link de cadastro só aparece para admin */}
        {isAdmin && (
          <Link href="/cadastro">
            <a>Cadastro</a>
          </Link>
        )}

        {/* Botão de logout */}
        <button onClick={handleLogout} className={navbarStyles.logoutButton}>Sair</button>
      </div>

      {/* Ícone do menu */}
      <div className={navbarStyles['menu-icon']} onClick={toggleMenu}>
        &#9776; {/* Ícone do menu hambúrguer */}
      </div>
    </div>
  );
}
