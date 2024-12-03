import Navbar from '../components/Navbar';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import Chart from '../components/Chart';

export default function Home() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulando os dados da API do ThingSpeak
    const mockData = [
      { label: 'Sensor 1', value: 20 },
      { label: 'Sensor 2', value: 35 },
      { label: 'Sensor 3', value: 45 },
    ];
    setChartData(mockData);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Painel de Controle</title>
        <meta name="description" content="Dashboard de Controle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar /> {/* Incluindo a Navbar aqui */}

      <main className={styles.main}>
        <h1 className={styles.title}>Bem-vindo ao Painel de Controle!</h1>

        <div style={{ padding: '20px', width: '100%', maxWidth: '800px' }}>
          <h2>Gráfico de Sensores</h2>
          <Chart data={chartData} />
        </div>
      </main>
    </div>
  );
}
