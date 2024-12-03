import Head from 'next/head';
import homeStyles from '../styles/Home.module.css'; // Importando o CSS atualizado
import navbarStyles from '../styles/Navbar.module.css'; // Importando o CSS da navbar
import Navbar from '../components/Navbar'; // Adicionando o Navbar
import { useEffect, useState } from 'react'; // Importando hooks para controle de estado e efeito
import { Line } from 'react-chartjs-2'; // Importando o gráfico de linha do react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registrando os componentes do ChartJS necessários
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);

  // Função para buscar os dados do backend
  const fetchData = async () => {
    try {
      const response = await fetch('/api/temperature'); // Supondo que o backend tenha esse endpoint
      const data = await response.json();
      setTemperatureData(data.temperatures);
      setHumidityData(data.humidity);
      setLabels(data.labels);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Hook para carregar os dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  // Dados para o gráfico de temperatura
  const temperatureChartData = {
    labels: labels, // Labels do gráfico (por exemplo, horários ou datas)
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  // Dados para o gráfico de umidade
  const humidityChartData = {
    labels: labels, // Labels do gráfico (mesmo conjunto de labels)
    datasets: [
      {
        label: 'Umidade (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Painel</title>
        <meta name="description" content="Dashboard de Controle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar /> {/* Agora Navbar é utilizado aqui */}

      <div className={navbarStyles.navbar}>
  
      </div>

      <main className={homeStyles.main}>

        {/* Gráfico de Temperatura */}
        <div className={homeStyles.chartContainer}>
          <h2 className={homeStyles.chartTitle}>Temperatura</h2>
          <Line data={temperatureChartData} />
        </div>

        {/* Gráfico de Umidade */}
        <div className={homeStyles.chartContainer}>
          <h2 className={homeStyles.chartTitle}>Umidade</h2>
          <Line data={humidityChartData} />
        </div>
      </main>
    </div>
  );
}
