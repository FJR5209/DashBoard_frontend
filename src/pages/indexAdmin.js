import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import axios from 'axios';

const IndexAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('https://dashboardbackend-production-756c.up.railway.app/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://dashboardbackend-production-756c.up.railway.app/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // Recarregar a lista de usuários após a exclusão
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
    }
  };

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>Erro ao carregar usuários: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <h2>Gerenciar Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexAdmin;
