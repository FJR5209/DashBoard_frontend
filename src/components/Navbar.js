/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Importando o hook useRouter do Next.js
import Link from 'next/link';
import navbarStyles from '../styles/Navbar.module.css'; // Importando os estilos da Navbar

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar o menu
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin
  const [isOnline, setIsOnline] = useState(false); // Estado para verificar o status da API
  const router = useRouter(); // Hook para redirecionar após logout

  useEffect(() => {
    // Verifique o papel do usuário a partir do token ou contexto de autenticação
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (token) {
      try {
        // Decodificando o token JWT
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando o token (exemplo de JWT)

        // Verificando se o papel é admin
        if (decodedToken.user && decodedToken.user.role === 'admin') {
          setIsAdmin(true); // Se o papel for admin, altere o estado
        }
      } catch {
        console.error('Erro ao decodificar token');
      }
    }

    // Função para verificar o status da API
    const checkAPIStatus = async () => {
      try {
        const response = await fetch('https://dashboardbackend-production-756c.up.railway.app/api/thingspeak/fetch'); // URL de verificação
        if (response.ok) {
          setIsOnline(true); // API funcionando corretamente
        } else {
          setIsOnline(false); // API fora do ar
        }
      } catch (error) {
        setIsOnline(false); // Se não conseguir se conectar, assume como offline
      }
    };

    checkAPIStatus(); // Verifica o status da API ao carregar a página

    // Atualiza a cada 10 segundos (ajustável conforme necessidade)
    const interval = setInterval(checkAPIStatus, 10000);
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []); // Dependências vazias para rodar apenas uma vez

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
      <h1>
        STU
        {/* Exibe a luz verde se estiver online, vermelha se estiver offline */}
        {isOnline ? ' Online' : ' Offline'}
        <span className={isOnline ? navbarStyles.online : navbarStyles.offline}></span>
      </h1>


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
