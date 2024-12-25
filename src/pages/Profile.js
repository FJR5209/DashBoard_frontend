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

  const handleAddData = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        alert('Erro: Nenhum token de autenticação encontrado.');
        return;
      }

      const response = await fetch(
        `https://dashboardbackend-production-756c.up.railway.app/api/auth/users/me`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tempLimit: editForm.tempLimit || userData.tempLimit,
            humidityLimit: editForm.humidityLimit || userData.humidityLimit,
            devices: [
              ...(userData.devices || []),
              ...editForm.devices.split(',').map((d) => d.trim()),
            ],
          }),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData.updatedData);
        alert('Dados adicionados com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar dados: ${errorData.msg || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error('Erro ao adicionar dados:', err);
      alert('Erro ao adicionar dados: ' + err.message);
    }
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
              <button
                className="btn btn-primary"
                style={buttonStyle}
                onClick={() => handleEdit(userData)}
              >
                Editar
              </button>
            </div>
          )}

          {editingUser && (
            <div className="mt-4">
              <h3>Editar Usuário</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Limite de Temperatura</label>
                  <input
                    type="number"
                    name="tempLimit"
                    className="form-control"
                    value={editForm.tempLimit}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Limite de Umidade</label>
                  <input
                    type="number"
                    name="humidityLimit"
                    className="form-control"
                    value={editForm.humidityLimit}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Dispositivos</label>
                  <input
                    type="text"
                    name="devices"
                    className="form-control"
                    value={editForm.devices}
                    onChange={handleEditChange}
                  />
                  <small className="form-text text-muted">Separe os dispositivos por vírgula.</small>
                </div>
                <button type="submit" className="btn btn-success" style={buttonStyle}>
                  Atualizar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ml-2"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}

          {userData && userData.role === 'admin' && (
            <div className="mt-4">
              <h3>Lista de Usuários</h3>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger ml-2"
                          onClick={() => handleDelete(user._id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
}
