"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { API_LOGIN, FEED } from '@/constants/routes';
import api from '@/utils/api';
import { TOKEN } from '@/constants/storage';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await api.post(API_LOGIN, {email, password})
      .then((response: any) => {
        swal("Successo!", "Bem-vind@ à Dialog", "success");
        localStorage.setItem(TOKEN, response.token);
        router.push(FEED);
      })
      .catch (() => swal("Ops!", "Você submeteu suas credenciais corretamente?", "error"));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
