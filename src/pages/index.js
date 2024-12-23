import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import homeStyles from '../styles/Home.module.css'; // Importando o estilo da página
import Navbar from '../components/Navbar'; // Componente de Navegação

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Obtém o token de autenticação armazenado
    if (!token) {
      router.push('/login'); // Redireciona para a página de login se não houver token
    }
  }, [router]);

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Sobre o Sistema</title>
      </Head>
      <Navbar />
      <main className={homeStyles.main}>
        <h1 className="text-center mt-4">Bem-vindo ao Nosso Sistema</h1>
        <p className="mt-3">
          Este é um sistema de monitoramento de temperatura e umidade projetado para ajudar empresas a gerenciar câmaras frias de forma eficiente.
        </p>
        <p>
          Nosso sistema coleta dados em tempo real, permitindo controle e alertas automáticos para garantir a segurança e a qualidade dos produtos armazenados.
        </p>
        <div className="text-center mt-5">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => router.push('/Alerts')}
          >
            Ver Estatísticas
          </button>
        </div>
      </main>
    </div>
  );
}
