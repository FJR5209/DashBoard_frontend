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

  const BACKEND_URL = 'https://dashboardbackend-production-756c.up.railway.app/api/thingspeak'; // URL do backend

  // Função para buscar os dados do backend
  const fetchData = async () => {
    try {
      const response = await fetch(BACKEND_URL + '/fetch'); // Chama a rota que coleta dados manualmente
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do backend');
      }
      const data = await response.json();
  
      console.log('Resposta da API:', data);  // Loga a resposta completa para verificar a estrutura
  
      if (data && data.temperature && data.humidity && data.time) {
        // Atualiza os estados com os dados recebidos
        setTemperatureData([data.temperature]);
        setHumidityData([data.humidity]);
        setLabels([data.time]);
      } else {
        throw new Error('Dados de temperatura, umidade ou hora não encontrados');
      }
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

  const lastTemperatureData = temperatureData.slice(-10);
  const lastHumidityData = humidityData.slice(-10);
  const lastLabels = labels.slice(-10);

  const temperatureChartData = {
    labels: lastLabels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: lastTemperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const humidityChartData = {
    labels: lastLabels,
    datasets: [
      {
        label: 'Umidade (%)',
        data: lastHumidityData,
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
