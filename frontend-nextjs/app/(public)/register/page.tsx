"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { API_REGISTER, LOGIN } from '@/constants/routes';
import api from '@/utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      swal("Ops!", "As senhas não coincidem!", "error");
      return;
    }

    await api.post(API_REGISTER, { name, email, password })
      .then(() => {
        swal("Successo!", "Conta criada com sucesso!", "success");
        router.push(LOGIN);
      })
      .catch(() => swal("Ops!", "Houve um problema na criação da conta", "error"));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Registrar</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-gray-700">Repita a Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
