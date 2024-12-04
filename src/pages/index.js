import Head from 'next/head';
import homeStyles from '../styles/Home.module.css'; // Importando o CSS atualizado
import navbarStyles from '../styles/Navbar.module.css'; // Importando o CSS da navbar
import Navbar from '../components/Navbar'; // Adicionando o Navbar
import { useEffect, useState } from 'react'; // Importando hooks para controle de estado e efeito
import { Line } from 'react-chartjs-2'; // Importando o gráfico de linha do react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'; // Importando o Filler plugin

// Registrando os componentes do ChartJS necessários, incluindo o Filler
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Home() {
  const [temperatureData, setTemperatureData] = useState([]); // Dados de temperatura
  const [humidityData, setHumidityData] = useState([]); // Dados de umidade
  const [labels, setLabels] = useState([]); // Labels (e.g., timestamps)
  const [loading, setLoading] = useState(true); // Para controle de carregamento
  const [error, setError] = useState(null); // Para controle de erros

  const BACKEND_URL = 'https://dashboardbackend-production-756c.up.railway.app/'; // URL do backend

  // Função para buscar os dados do backend
  const fetchData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/thingspeak`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do backend');
      }
      const data = await response.json();

      // Transformando os dados do JSON recebido
      const temperatures = data.feeds.map(feed => parseFloat(feed.field1)); // Temperaturas
      const humidity = data.feeds.map(feed => parseFloat(feed.field2)); // Umidade
      const timestamps = data.feeds.map(feed => new Date(feed.created_at).toLocaleString()); // Timestamps

      // Atualizando os estados com os dados recebidos
      setTemperatureData(prevData => [...prevData, ...temperatures]); // Acumulando dados de temperatura
      setHumidityData(prevData => [...prevData, ...humidity]); // Acumulando dados de umidade
      setLabels(prevLabels => [...prevLabels, ...timestamps]); // Acumulando labels (timestamps)
    } catch (error) {
      setError(error.message); // Caso ocorra erro, atualizar o estado de erro
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false); // Atualizando o estado de carregamento após a requisição
    }
  };

  // Função para calcular a média de um array
  const calculateAverage = (data) => {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return (sum / data.length).toFixed(2); // Retorna a média com 2 casas decimais
  };

  // Hook para carregar os dados ao montar o componente
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(); // Atualiza os dados a cada 5 segundos
    }, 5000); // Atualização a cada 5 segundos (5000ms)

    // Limpar intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  // Calculando as médias
  const temperatureAverage = calculateAverage(temperatureData); // Média da temperatura
  const humidityAverage = calculateAverage(humidityData); // Média da umidade

  // Filtrando os últimos 10 dados para os gráficos
  const last10TemperatureData = temperatureData.slice(-10);
  const last10HumidityData = humidityData.slice(-10);
  const last10Labels = labels.slice(-10);

  // Dados para o gráfico de temperatura
  const temperatureChartData = {
    labels: last10Labels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: last10TemperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true, // Preenchimento do gráfico
        tension: 0.4, // Deixa o gráfico mais suave
      },
    ],
  };

  // Dados para o gráfico de umidade
  const humidityChartData = {
    labels: last10Labels,
    datasets: [
      {
        label: 'Umidade (%)',
        data: last10HumidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true, // Preenchimento do gráfico
        tension: 0.4, // Deixa o gráfico mais suave
      },
    ],
  };

  // Se estiver carregando ou houver erro, renderiza o status
  if (loading) {
    return (
      <div className={homeStyles.container}>
        <Head>
          <title>Painel</title>
          <meta name="description" content="Dashboard de Controle" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar /> {/* Navbar está sendo utilizada aqui */}

        <div className={navbarStyles.navbar}></div>

        <main className={homeStyles.main}>
          <h2>Carregando dados...</h2> {/* Mensagem de carregamento */}
        </main>
      </div>
    );
  }

  // Exibe erro se houver
  if (error) {
    return (
      <div className={homeStyles.container}>
        <Head>
          <title>Painel</title>
          <meta name="description" content="Dashboard de Controle" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar /> {/* Navbar está sendo utilizada aqui */}

        <div className={navbarStyles.navbar}></div>

        <main className={homeStyles.main}>
          <h2>Erro ao carregar dados: {error}</h2> {/* Exibe erro caso aconteça */}
        </main>
      </div>
    );
  }

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Painel</title>
        <meta name="description" content="Dashboard de Controle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar /> {/* Navbar está sendo utilizada aqui */}

      <div className={navbarStyles.navbar}></div>

      <main className={homeStyles.main}>
        <div className={homeStyles.chartContainer}>
          {/* Gráfico de Temperatura */}
          <h2 className={homeStyles.chartTitle}>
            Temperatura
            <span className={homeStyles.average}>
              {` Média: ${temperatureAverage}°C`}
            </span>
          </h2>
          <Line data={temperatureChartData} />
        </div>

        <div className={homeStyles.chartContainer}>
          {/* Gráfico de Umidade */}
          <h2 className={homeStyles.chartTitle}>
            Umidade
            <span className={homeStyles.average}>
              {` Média: ${humidityAverage}%`}
            </span>
          </h2>
          <Line data={humidityChartData} />
        </div>
      </main>
    </div>
  );
}
