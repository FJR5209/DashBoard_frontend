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
    const [editForm, setEditForm] = useState({ name: '', email: '' });

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
            'https://dashboardbackend-production-756c.up.railway.app/api/auth/users',
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
            if (Array.isArray(data)) {
              setUsersList(data);
            } else {
              setUserData(data);
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

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [router]);

    const handleEdit = (user) => {
      setEditingUser(user);
      setEditForm({ name: user.name, email: user.email });
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
          `https://dashboardbackend-production-756c.up.railway.app/api/auth/users/${editingUser._id}`,
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
          `https://dashboardbackend-production-756c.up.railway.app/api/auth/users/${id}`,
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
        alert('Erro ao excluir o usuário: ' + err.message);
      }
    };

    const handleCancelEdit = () => {
      setEditingUser(null);
      setEditForm({ name: '', email: '' });
    };

    if (loading) return <p className={styles.loading}>Carregando...</p>;
    if (error) return <p className={styles.error}>Erro: {error}</p>;

    return (
      <div className={styles.container}>
        <Navbar />
        {userData ? (
          <div className={styles.profileInfo}>
            <h3>{userData.name}</h3>
            <p>Email: {userData.email}</p>
          </div>
        ) : (
          <div className={styles.usersList}>
            <h3>Lista de Usuários</h3>
            <ul>
              {usersList.map((user) => (
                <li key={user._id}>
                  {user.name} - {user.email}
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user._id)}>Deletar</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {editingUser && (
          <div className={styles.editForm}>
            <h3>Editando: {editingUser.name}</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={editForm.name === editingUser.name && editForm.email === editingUser.email}
              >
                Salvar
              </button>
              <button type="button" onClick={handleCancelEdit}>
                Cancelar
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
