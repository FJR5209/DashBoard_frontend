import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Importando o useRouter para redirecionamento
import Head from 'next/head';
import homeStyles from '../styles/Home.module.css'; // Importando o CSS atualizado
import Navbar from '../components/Navbar'; // Adicionando o Navbar
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registrando os componentes do ChartJS necessários
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Home() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Inicializando o useRouter

  const BACKEND_URL = 'https://dashboardbackend-production-756c.up.railway.app/api/thingspeak';

  // Função para buscar os dados do backend
  const fetchData = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do backend');
      }
      const data = await response.json();

      const temperatures = data.feeds.map(feed => parseFloat(feed.field1));
      const humidity = data.feeds.map(feed => parseFloat(feed.field2));
      const timestamps = data.feeds.map(feed => new Date(feed.created_at).toLocaleString());

      setTemperatureData(prevData => [...prevData, ...temperatures]);
      setHumidityData(prevData => [...prevData, ...humidity]);
      setLabels(prevLabels => [...prevLabels, ...timestamps]);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular a média de um array
  const calculateAverage = (data) => {
    if (data.length === 0) return 'N/A';
    const sum = data.reduce((acc, value) => acc + value, 0);
    return (sum / data.length).toFixed(2);
  };

  // Verificando o token e redirecionando para a página de login se não houver token
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Obtendo o token armazenado
    if (!token) {
      router.push('/login'); // Redireciona para a página de login caso o token não exista
    } else {
      fetchData(); // Se o token existir, busca os dados do backend
      const interval = setInterval(fetchData, 5000); // Atualiza os dados a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [router]);

  const temperatureAverage = calculateAverage(temperatureData);
  const humidityAverage = calculateAverage(humidityData);

  const last10TemperatureData = temperatureData.slice(-10);
  const last10HumidityData = humidityData.slice(-10);
  const last10Labels = labels.slice(-10);

  const temperatureChartData = {
    labels: last10Labels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: last10TemperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const humidityChartData = {
    labels: last10Labels,
    datasets: [
      {
        label: 'Umidade (%)',
        data: last10HumidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className={homeStyles.container}>
        <Head>
          <title>Carregando...</title>
        </Head>
        <Navbar />
        <main className={homeStyles.main}>
          <h2>Carregando dados...</h2>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={homeStyles.container}>
        <Head>
          <title>Erro</title>
        </Head>
        <Navbar />
        <main className={homeStyles.main}>
          <h2>Erro ao carregar dados: {error}</h2>
        </main>
      </div>
    );
  }

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Painel</title>
      </Head>
      <Navbar />
      <main className={homeStyles.main}>
        <div className={homeStyles.chartContainer}>
          <h2>
            Temperatura
            <span> Média: {temperatureAverage}°C</span>
          </h2>
          <Line data={temperatureChartData} />
        </div>

        <div className={homeStyles.chartContainer}>
          <h2>
            Umidade
            <span> Média: {humidityAverage}%</span>
          </h2>
          <Line data={humidityChartData} />
        </div>
      </main>
    </div>
  );
}