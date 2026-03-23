import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white">ColectiSoft</h1>
          <p className="text-gray-300 mt-2">Plataforma Gerencial de Seguros</p>
        </div>
        <LoginForm />
        <div className="text-center text-gray-400 text-xs mt-8">
          © {new Date().getFullYear()} SegurosPro. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;