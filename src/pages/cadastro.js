import React, { useState } from 'react';
import styles from '../styles/cadastro.module.css';
import Navbar from '../components/Navbar'; // Importação da Navbar
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importando o Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importando o estilo do Toastify

const Cadastro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tempLimit: '',
    role: 'user',
    humidityLimit: '',
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
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
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
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
      toast.error(`Erro ao cadastrar: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      <Navbar /> {/* Adicionando a Navbar */}
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <label className={styles.formLabel} htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome"
            required
            className={styles.formInput}
          />

          <label className={styles.formLabel} htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
            required
            className={styles.formInput}
          />

          <label className={styles.formLabel} htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
            required
            className={styles.formInput}
          />

          <label className={styles.formLabel} htmlFor="tempLimit">Limite de Temperatura:</label>
          <input
            type="number"
            id="tempLimit"
            name="tempLimit"
            value={formData.tempLimit}
            onChange={handleChange}
            placeholder="Digite o limite de temperatura"
            required
            className={styles.formInput}
          />

          <label className={styles.formLabel} htmlFor="role">Função:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.formSelect}
          >
            <option value="admin">Admin</option>
            <option value="user">Usuário</option>
          </select>

          <label className={styles.formLabel} htmlFor="humidityLimit">Limite de Umidade:</label>
          <input
            type="number"
            id="humidityLimit"
            name="humidityLimit"
            value={formData.humidityLimit}
            onChange={handleChange}
            placeholder="Digite o limite de umidade"
            required
            className={styles.formInput}
          />

          <button type="submit" className={styles.formButton}>Cadastrar</button>
        </form>

        {/* Toast Container para exibir as mensagens */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Cadastro;
