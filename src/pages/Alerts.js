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

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('https://dashboardbackend-production-756c.up.railway.app/api/thingspeak/alerts');
        if (!response.ok) {
          throw new Error('Erro ao carregar os alertas');
        }
        const data = await response.json();

        const temperatures = data.map(alert => parseFloat(alert.currentTemperature));
        const humidity = data.map(alert => parseFloat(alert.currentHumidity));
        const timestamps = data.map(alert => new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 'h');

        const limitedTemperatures = temperatures.slice(-8);
        const limitedHumidity = humidity.slice(-8);
        const limitedTimestamps = timestamps.slice(-8);

        setTemperatureData(limitedTemperatures);
        setHumidityData(limitedHumidity);
        setLabels(limitedTimestamps);

        setMaxTemp(Math.max(...limitedTemperatures));
        setMinTemp(Math.min(...limitedTemperatures));
        setMaxHumidity(Math.max(...limitedHumidity));
        setMinHumidity(Math.min(...limitedHumidity));
      } catch (error) {
        setError('Erro ao carregar os alertas: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleClearData = () => {
    setTemperatureData([]);
    setHumidityData([]);
    setLabels([]);
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
            <Line data={{
              labels,
              datasets: [{
                label: 'Temperatura (°C)',
                data: temperatureData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
              }],
            }} />
            <div className={homeStyles.chartStats}>
              <p>Maior: {maxTemp}°C</p>
              <p>Menor: {minTemp}°C</p>
            </div>
          </div>

          <div className={homeStyles.chartSection}>
            <h2>Umidade</h2>
            <span>Média: {humidityAverage}%</span>
            <Line data={{
              labels,
              datasets: [{
                label: 'Umidade (%)',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
              }],
            }} />
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
