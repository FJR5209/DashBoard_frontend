import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Adicionando o Navbar
import styles from '../styles/Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    tempLimit: '',
    humidityLimit: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(
          'http://localhost:3001/api/auth/users/me', // Rota para obter dados do usuário logado
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar dados: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (isMounted) {
          setUserData(data);
          if (data.role === 'admin') {
            fetchUsersList(token); // Se for admin, pega todos os usuários
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao buscar dados:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchUsersList = async (token) => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/auth/users', // Para o admin, pega todos os usuários
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao buscar usuários: ${response.status} - ${errorText}`);
        }
        const usersData = await response.json();
        if (isMounted) {
          setUsersList(usersData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao buscar usuários:', err);
          setError(err.message);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      tempLimit: user.tempLimit,
      humidityLimit: user.humidityLimit,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        alert('Erro: Nenhum token de autenticação encontrado.');
        return;
      }
    
      const response = await fetch(
        `http://localhost:3001/api/auth/users/${editingUser._id}`, // Requisição PUT para o usuário específico
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );
    
      if (response.ok) {
        const updatedUser = await response.json();
        setUsersList((prev) =>
          prev.map((user) => (user._id === updatedUser._id ? updatedUser : user))
        );
        alert('Usuário atualizado com sucesso!');
        setEditingUser(null);
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar usuário: ${errorData.msg || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Erro ao atualizar o usuário:', err);
      alert('Erro ao atualizar o usuário: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3001/api/auth/users/${id}`, // Requisição DELETE
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsersList((prev) => prev.filter((user) => user._id !== id));
        alert('Usuário excluído com sucesso!');
      } else {
        const errorText = await response.text();
        alert(`Erro ao excluir usuário: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Erro ao excluir o usuário:', err);
      alert('Erro ao excluir o usuário:' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', tempLimit: '', humidityLimit: '' });
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>Erro: {error}</p>;

  return (
    <div className={styles.container}>
      <Navbar />
{usersList.length > 0 ? (
        <div className={styles.usersList}>
        {usersList.map((user) => (
          <div key={user._id} className={styles.userItem}>
            <p>{user.name}</p>
            <button onClick={() => handleEdit(user)}>Editar</button>
            <button onClick={() => handleDelete(user._id)}>Excluir</button>
          </div>
        ))}
      </div>
      ) : (
        <div className={styles.profileInfo}>
          <h3>{userData.name}</h3>
          <p>Email: {userData.email}</p>
          <p>Limite de Temperatura: {userData.tempLimit}</p>
          <p>Limite de Umidade: {userData.humidityLimit}</p>
          <button onClick={() => handleEdit(userData)}>Editar</button>

        </div>
      )}

      {editingUser && (
        <form onSubmit={handleEditSubmit} className={styles.editForm}>
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Limite de Temperatura:
            <input
              type="number"
              name="tempLimit"
              value={editForm.tempLimit}
              onChange={handleEditChange}
            />
          </label>
          <label>
            Limite de Umidade:
            <input
              type="number"
              name="humidityLimit"
              value={editForm.humidityLimit}
              onChange={handleEditChange}
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
