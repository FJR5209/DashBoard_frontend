import { useState, useEffect } from 'react';
import styles from '/styles/Login.module.css';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const BACKEND_URL = 'https://dashboardbackend-production-756c.up.railway.app/api/auth/login'; // URL do seu backend

  // Verificar se o usuário já está logado (verificando o token no localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/'); // Redireciona para a página principal ou dashboard se já estiver logado
    }
  }, [router]);

  // Função para fazer o login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao realizar login');
      }

      const data = await response.json();

      // Armazenando o token no localStorage
      localStorage.setItem('authToken', data.token); // Armazena o token no localStorage
      console.log('Token após login:', data.token); // Verifique no console se o token foi armazenado corretamente
      router.push('/'); // Redireciona para a página principal ou dashboard após login bem-sucedido
    } catch (err) {
      setError(err.message); // Exibe a mensagem de erro
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h1 className={styles.title}>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}
