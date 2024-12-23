

import { useEffect, useState } from 'react';
import Head from 'next/head';
import homeStyles from '../styles/alert.module.css';
import Navbar from '../components/Navbar';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [maxTemp, setMaxTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxHumidity, setMaxHumidity] = useState(null);
  const [minHumidity, setMinHumidity] = useState(null);
  const [deviceId, setDeviceId] = useState(null); // Estado para armazenar o dispositivo

  useEffect(() => {
    const fetchDeviceAndAlerts = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        // Buscar o dispositivo do usuário logado
        const userResponse = await fetch(
          'https://dashboardbackend-production-756c.up.railway.app/api/auth/users/me', // Ajuste para o endpoint local
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error('Erro ao buscar informações do usuário');
        }

        const userData = await userResponse.json();
        console.log('Dados do usuário logado:', userData); // Log para verificar o retorno

        // Verificar se o campo `devices` existe e contém ao menos um valor
        if (!Array.isArray(userData.devices) || userData.devices.length === 0) {
          throw new Error('Nenhum dispositivo associado ao usuário');
        }

        // Pega o primeiro dispositivo do array
        const userDeviceId = userData.devices[0];
        setDeviceId(userDeviceId);

        // Buscar alertas do dispositivo
        await fetchAlerts(userDeviceId);
      } catch (error) {
        setError('Erro ao carregar os dados: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAlerts = async (device) => {
      try {
        const response = await fetch(
          `https://dashboardbackend-production-756c.up.railway.app/api/devices/${device}/latest` // Substitui dinamicamente o dispositivo
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar os dados do dispositivo');
        }

        const data = await response.json();

        // Extraindo dados
        const temperature = parseFloat(data.temperatura);
        const humidity = parseFloat(data.umidade);
        const rawTime = new Date(data.timeCollected);

        // Ajustando para o fuso horário do Acre (UTC-5)
        const adjustedTime = new Date(rawTime.getTime() - 5 * 60 * 60 * 1000);

        const options = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        };

        const formattedTime = adjustedTime.toLocaleTimeString('en-US', options) + 'h';

        // Atualizando os dados, limitando a 8 registros
        setTemperatureData((prev) => {
          const updatedData = [...prev, temperature];
          return updatedData.length > 8 ? updatedData.slice(1) : updatedData;
        });

        setHumidityData((prev) => {
          const updatedData = [...prev, humidity];
          return updatedData.length > 8 ? updatedData.slice(1) : updatedData;
        });

        setLabels((prev) => {
          const updatedLabels = [...prev, formattedTime];
          return updatedLabels.length > 8 ? updatedLabels.slice(1) : updatedLabels;
        });

        // Recalculando as estatísticas
        const newTemperatures = [...temperatureData, temperature].slice(-8);
        const newHumidity = [...humidityData, humidity].slice(-8);

        setMaxTemp(Math.max(...newTemperatures));
        setMinTemp(Math.min(...newTemperatures));
        setMaxHumidity(Math.max(...newHumidity));
        setMinHumidity(Math.min(...newHumidity));
      } catch (error) {
        setError('Erro ao carregar os dados do dispositivo: ' + error.message);
      }
    };

    fetchDeviceAndAlerts();

    // Atualização periódica a cada 60 segundos
    const interval = setInterval(() => {
      if (deviceId) {
        fetchAlerts(deviceId);
      }
    }, 30000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]); // Adiciona o comentário para ignorar a regra


  const handleClearData = () => {
    setTemperatureData([]);
    setHumidityData([]);
    setLabels([]);
    setMaxTemp(null);
    setMinTemp(null);
    setMaxHumidity(null);
    setMinHumidity(null);
  };

  const calculateAverage = (data) => {
    if (data.length === 0) return 'N/A';
    const sum = data.reduce((acc, value) => acc + value, 0);
    return (sum / data.length).toFixed(2);
  };

  const temperatureAverage = calculateAverage(temperatureData);
  const humidityAverage = calculateAverage(humidityData);

  const buttonStyle = {
    backgroundColor: '#6200ea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const darkThemeStyle = {
    backgroundColor: '#121212',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
  };

  return (
    <div style={darkThemeStyle}>
      <Head>
        <title>Estatísticas</title>
      </Head>
      <Navbar />
      <main className={homeStyles.main}>
        <h1>Estatísticas</h1>

        {loading && <p>Carregando dados...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className={homeStyles.chartContainer}>
          <div className={homeStyles.chartSection}>
            <h2>Temperatura</h2>
            <span>Média: {temperatureAverage}°C</span>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Temperatura (°C)',
                    data: temperatureData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
            />
            <div className={homeStyles.chartStats}>
              <p>Maior: {maxTemp}°C</p>
              <p>Menor: {minTemp}°C</p>
            </div>
          </div>

          <div className={homeStyles.chartSection}>
            <h2>Umidade</h2>
            <span>Média: {humidityAverage}%</span>
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: 'Umidade (%)',
                    data: humidityData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
            />
            <div className={homeStyles.chartStats}>
              <p>Maior: {maxHumidity}%</p>
              <p>Menor: {minHumidity}%</p>
            </div>
          </div>
        </div>

        <div className={homeStyles.clearButtonContainer}>
          <button onClick={handleClearData} style={buttonStyle}>
            Limpar Dados
          </button>
        </div>
      </main>
    </div>
  );
}
