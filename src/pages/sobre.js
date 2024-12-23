import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Sobre.module.css'; // Estilos importados
import Navbar from '../components/Navbar'; // Navbar fixa e independente

export default function Sobre() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Sobre o Sistema</title>
      </Head>
      <Navbar /> {/* Navbar permanece fixa */}
      <main className={styles.main}>
        <h1 className={styles.title}>Sobre o Sistema de Monitoramento de Temperatura e Umidade</h1>
        <p className={styles.text}>
          Nosso sistema de monitoramento de temperatura e umidade foi concebido para atender à crescente necessidade de controle ambiental em setores críticos da economia e da sociedade. Ele oferece uma solução inovadora e acessível para empresas, organizações e instituições que lidam com produtos e processos sensíveis às variações climáticas.
        </p>
        <p className={styles.text}>
          A tecnologia embarcada neste dispositivo foi desenvolvida para captar dados precisos em tempo real, registrá-los e disponibilizá-los de forma clara e intuitiva para os gestores, permitindo o acompanhamento contínuo de condições ambientais e a tomada de decisões rápidas e assertivas.
        </p>

        <h2 className={styles.subtitle}>A Importância do Controle de Temperatura e Umidade</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <strong>Saúde e Farmacêutica:</strong> Medicamentos, vacinas e outros insumos biológicos dependem de condições de armazenamento específicas para preservar sua eficácia e segurança.
          </li>
          <li className={styles.listItem}>
            <strong>Indústria Alimentícia:</strong> Alimentos congelados, laticínios, carnes e outros produtos perecíveis precisam de armazenamento controlado para evitar contaminações, deterioração e perdas.
          </li>
          <li className={styles.listItem}>
            <strong>Tecnologia e Eletrônicos:</strong> Equipamentos eletrônicos e semicondutores são extremamente sensíveis à umidade elevada.
          </li>
          <li className={styles.listItem}>
            <strong>Agricultura e Armazenamento de Grãos:</strong> O excesso de umidade favorece a proliferação de fungos e pragas.
          </li>
        </ul>

        <h2 className={styles.subtitle}>Diferenciais do Sistema</h2>
        <p className={styles.text}>
          O sistema é equipado com sensores de alta precisão, conectividade à internet e um software inteligente capaz de registrar dados continuamente, gerar alertas em tempo real e fornecer relatórios detalhados.
        </p>

        <h2 className={styles.subtitle}>Relevância Acadêmica e Científica</h2>
        <p className={styles.text}>
          Este projeto é parte integrante do Trabalho de Conclusão de Curso (TCC) do aluno <strong>Fredson Junior</strong>, sob a orientação do professor <strong>Angelo Maggioni</strong>. Ele explora a aplicação prática de conceitos de Internet das Coisas (IoT), computação em nuvem e design de sistemas embarcados.
        </p>

        <h2 className={styles.subtitle}>Impacto do Projeto</h2>
        <p className={styles.text}>
          A implementação deste sistema aumenta a eficiência operacional, reduz desperdícios e promove sustentabilidade, trazendo benefícios para empresas e comunidades.
        </p>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => router.push('/')}>
            Voltar para a Página Inicial
          </button>
        </div>
      </main>
    </div>
  );
}
