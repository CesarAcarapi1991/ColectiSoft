import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">Página no encontrada</p>
      <Link to="/dashboard" className="text-blue-600 hover:underline">
        Volver al dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;