// import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import Input from '../common/Input';
// import Button from '../common/Button';
// import Card from '../common/Card';

// const LoginForm: React.FC = () => {
//   const [correo, setCorreo] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<{ correo?: string; password?: string }>({});
//   const { login } = useAuth();

//   const validate = () => {
//     const newErrors: typeof errors = {};
//     if (!correo) newErrors.correo = 'El correo es requerido';
//     else if (!/\S+@\S+\.\S+/.test(correo)) newErrors.correo = 'Correo inválido';
//     if (!password) newErrors.password = 'La contraseña es requerida';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       await login(correo, password);
//       // Redirección manejada por rutas protegidas
//     } catch (error) {
//       // El toast ya se muestra en el contexto
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
//       <form onSubmit={handleSubmit}>
//         <Input
//           label="Correo electrónico"
//           type="email"
//           value={correo}
//           onChange={(e) => setCorreo(e.target.value)}
//           error={errors.correo}
//           placeholder="admin@seguro.com"
//         />
//         <Input
//           label="Contraseña"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           error={errors.password}
//           placeholder="••••••"
//         />
//         <Button type="submit" className="w-full mt-2" disabled={loading}>
//           {loading ? 'Ingresando...' : 'Ingresar'}
//         </Button>
//       </form>
//     </Card>
//   );
// };

// export default LoginForm;

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ correo?: string; password?: string }>({});
  const { login } = useAuth();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!correo) newErrors.correo = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(correo)) newErrors.correo = 'Correo inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(correo, password);
    } catch (error) {
      // El toast ya se muestra en el contexto
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            error={errors.correo}
            placeholder="admin@seguro.com"
            className="pl-10"
          />
        </div>
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••"
            className="pl-10"
          />
        </div>
        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
          {loading ? 'Ingresando...' : (
            <>
              <LogIn className="w-4 h-4" />
              Ingresar
            </>
          )}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Credenciales de prueba: admin@seguro.com / 1234565
        </p>
      </div>
    </Card>
  );
  
};

export default LoginForm;