import Head from 'next/head';
import { useEffect } from 'react';
import Studio from '../components/Studio';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pattern Music Studio</title>
        <meta name="description" content="Programmable Pattern Music Studio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <Studio />
      </main>

      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>Pattern Music Studio &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}