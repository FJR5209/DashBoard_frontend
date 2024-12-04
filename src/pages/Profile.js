import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import styles from '../styles/Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('https://dashboardbackend-production-756c.up.railway.app/api/auth/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar dados: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setUsersList(data);
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  if (error) {
    return <p className={styles.error}>Erro: {error}</p>;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Perfil do Usuário</h1>
        {userData && (
          <div className={styles.userInfo}>
            <p><strong>Nome:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Papel:</strong> {userData.role}</p>
          </div>
        )}
        {usersList.length > 0 && (
          <div className={styles.usersList}>
            <h2>Lista de Usuários</h2>
            <ul>
              {usersList.map((user) => (
                <li key={user.id}>
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>({user.role})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
