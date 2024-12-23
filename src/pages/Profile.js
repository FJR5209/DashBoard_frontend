import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    devices: '',
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
          'https://dashboardbackend-production-756c.up.railway.app/api/auth/users/me',
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
            fetchUsersList(token);
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
          throw new Error(`Erro ao buscar usuários: ${response.status} - ${errorText}`);
        }
        const usersData = await response.json();
        setUsersList(usersData);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError(err.message);
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
      name: user.name || '',
      email: user.email || '',
      tempLimit: user.tempLimit || '',
      humidityLimit: user.humidityLimit || '',
      devices: user.devices ? user.devices.join(', ') : '',
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
        `https://dashboardbackend-production-756c.up.railway.app/api/auth/users/${editingUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editForm,
            devices: editForm.devices.split(',').map((d) => d.trim()),
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUsersList((prev) =>
          prev.map((user) => (user._id === updatedUser.updatedData._id ? updatedUser.updatedData : user))
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
      alert('Erro ao excluir o usuário:' + err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      name: '',
      email: '',
      tempLimit: '',
      humidityLimit: '',
      devices: '',
    });
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  const buttonStyle = {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
    color: '#fff',
  };

  return (
    <div className="container-fluid bg-dark text-white py-4" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h1 className="text-center mb-4">Perfil</h1>
          {userData && (
            <div>
              <h3>{userData.name}</h3>
              <p>Email: {userData.email}</p>
              <p>Limite de Temperatura: {userData.tempLimit}</p>
              <p>Limite de Umidade: {userData.humidityLimit}</p>
              {Array.isArray(userData.devices) && userData.devices.length > 0 ? (
                <div>
                  <h5>Dispositivos:</h5>
                  <ul>
                    {userData.devices.map((device, index) => (
                      <li key={index}>{device}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Sem dispositivos associados.</p>
              )}
            </div>
          )}

          {editingUser && (
            <form onSubmit={handleEditSubmit} className="mt-4">
              <div className="mb-3">
                <label>Nome:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label>Limite de Temperatura:</label>
                <input
                  type="number"
                  name="tempLimit"
                  className="form-control"
                  value={editForm.tempLimit}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label>Limite de Umidade:</label>
                <input
                  type="number"
                  name="humidityLimit"
                  className="form-control"
                  value={editForm.humidityLimit}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <label>Dispositivos:</label>
                <textarea
                  name="devices"
                  className="form-control"
                  value={editForm.devices}
                  onChange={handleEditChange}
                  rows="3"
                  placeholder="Insira os dispositivos separados por vírgulas"
                ></textarea>
              </div>
              <button style={buttonStyle} className="btn btn-primary btn-lg me-2">
                Salvar
              </button>
              <button className="btn btn-secondary btn-lg" onClick={handleCancelEdit}>
                Cancelar
              </button>
            </form>
          )}

          {/* Lista de usuários com opções de editar e excluir */}
          {userData?.role === 'admin' && usersList.length > 0 && (
            <div>
              <h3 className="mt-5">Lista de Usuários:</h3>
              <ul className="list-group">
                {usersList.map((user) => (
                  <li key={user._id} className="list-group-item bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        {user.name} - {user.email}
                      </span>
                      <div>
                        <button
                          style={buttonStyle}
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
