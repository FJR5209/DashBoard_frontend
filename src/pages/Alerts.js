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
  const [deviceId, setDeviceId] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const ALERT_LIMIT = 5;
  const COOLDOWN_TIME = 10 * 60 * 1000; // 10 minutos

  useEffect(() => {
    const fetchDeviceAndAlerts = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) throw new Error('Token de autenticação não encontrado');
    
        const userResponse = await fetch(
          'https://dashboardbackend-production-756c.up.railway.app/api/auth/users/me',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!userResponse.ok) throw new Error('Erro ao buscar informações do usuário');
    
        const userData = await userResponse.json();
        console.log('UserData:', userData); // Verificando os dados do usuário
    
        // Corrigindo para usar _id ao invés de id
        const userId = userData._id; // Usando _id em vez de id
        console.log('UserId:', userId); // Verificando se o userId foi encontrado
    
        if (!Array.isArray(userData.devices) || userData.devices.length === 0) {
          throw new Error('Nenhum dispositivo associado ao usuário');
        }
    
        const userDeviceId = userData.devices[0];
        setDeviceId(userDeviceId);
    
        // Passando userId para a função de alerta
        await fetchAlerts(userDeviceId, userId);
      } catch (error) {
        setError('Erro ao carregar os dados: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    
    const fetchAlerts = async (device, userId) => {
      console.log(`Buscando alertas para o Device: ${device}, UserId: ${userId}`);
      try {
        const response = await fetch(
          `https://dashboardbackend-production-756c.up.railway.app/api/devices/${device}/latest`
        );
    
        if (!response.ok) throw new Error('Erro ao carregar os dados do dispositivo');
    
        const data = await response.json();
    
        const temperature = parseFloat(data.temperatura);
        const humidity = parseFloat(data.umidade);
    
        if (!isCooldown && alertCount < ALERT_LIMIT) {
          await sendAlert(userId, temperature, humidity); // Enviando o userId aqui
        } else if (alertCount >= ALERT_LIMIT) {
          setIsCooldown(true);
          setTimeout(() => {
            setAlertCount(0);
            setIsCooldown(false);
          }, COOLDOWN_TIME);
        }
    
        updateCharts(data);
      } catch (error) {
        setError('Erro ao carregar os dados do dispositivo: ' + error.message);
      }
    };
    
    const sendAlert = async (userId, temperature, humidity) => {
      console.log(`UserId: ${userId}, Temperatura: ${temperature}, Umidade: ${humidity}`);
      try {
        const response = await fetch('http://localhost:3001/api/alerts', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId, 
            temperatura: temperature,
            umidade: humidity,
          }),
        });
    
        if (response.ok) {
          setAlertCount((prevCount) => Math.min(prevCount + 1, ALERT_LIMIT));
        } else {
          console.error('Erro ao enviar alerta');
        }
      } catch (error) {
        console.error('Erro ao enviar alerta: ', error.message);
      }
    };
    
    
    
    const updateCharts = (data) => {
      const temperature = parseFloat(data.temperatura);
      const humidity = parseFloat(data.umidade);
      const rawTime = new Date(data.timeCollected);
      const adjustedTime = new Date(rawTime.getTime() - 5 * 60 * 60 * 1000);
      const formattedTime =
        adjustedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + 'h';

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

      setMaxTemp((prev) => (temperature > prev ? temperature : prev));
      setMinTemp((prev) => (temperature < prev ? temperature : prev));
      setMaxHumidity((prev) => (humidity > prev ? humidity : prev));
      setMinHumidity((prev) => (humidity < prev ? humidity : prev));
    };

    fetchDeviceAndAlerts();

    const interval = setInterval(() => {
      if (deviceId) fetchAlerts(deviceId);
    }, 30000);

    return () => clearInterval(interval);
  }, [deviceId, alertCount, isCooldown]);

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
