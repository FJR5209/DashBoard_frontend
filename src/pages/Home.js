// src/pages/index.js

import Navbar from '../components/Navbar'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Painel de Controle</title>
        <meta name="description" content="Dashboard de Controle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar /> {/* Incluindo a Navbar aqui */}

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bem-vindo ao Painel de Controle!
        </h1>
      </main>
    </div>
  )
}
