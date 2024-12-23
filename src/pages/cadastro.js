import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/cadastro.module.css';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tempLimit: '',
    role: 'user',
    humidityLimit: '',
    deviceId: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Token não encontrado!', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      const response = await axios.post(
        'https://dashboardbackend-production-756c.up.railway.app/api/auth/users/cadastro',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Usuário cadastrado com sucesso!', {
          position: "top-right",
          autoClose: 5000,
        });
        setFormData({
          name: '',
          email: '',
          password: '',
          tempLimit: '',
          role: 'user',
          humidityLimit: '',
        });
      } else {
        toast.error(`Erro: ${response.data.msg || 'Erro desconhecido'}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
      toast.error(`Erro ao cadastrar: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.centerContainer}>
        <form onSubmit={handleSubmit} className={`${styles.formContainer}`} style={{ animation: 'fadeIn 1s' }}>
          <h2 className="text-center mb-4" style={{ color: '#FFFFFF' }} >Cadastro</h2>
          <div className="form-group mb-3">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="tempLimit">Limite de Temperatura:</label>
            <input
              type="number"
              id="tempLimit"
              name="tempLimit"
              value={formData.tempLimit}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite o limite de temperatura"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="humidityLimit">Limite de Umidade:</label>
            <input
              type="number"
              id="humidityLimit"
              name="humidityLimit"
              value={formData.humidityLimit}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite o limite de umidade"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="deviceId">Dispositivo:</label>
            <input
              type="text"
              id="deviceId"
              name="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              className="form-control"
              placeholder="Digite o número do dispositivo"
              required
            />
          </div>


          <div className="form-group mb-3">
            <label htmlFor="role">Função:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="admin">Admin</option>
              <option value="user">Usuário</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{ animation: 'bounceIn 0.8s' }}>
            Cadastrar
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Cadastro;
