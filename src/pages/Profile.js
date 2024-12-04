import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    // Verifique se o token está no localStorage ou sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      // Se não houver token, redirecionar para a página de login
      router.push('/login');
    }

    // Caso o token tenha expirado ou seja inválido, redirecionar para login
    // (a verificação de expiração é feita no backend, mas aqui pode-se melhorar)
  }, [router]);

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      {/* Conteúdo da página de perfil */}
    </div>
  );
}
