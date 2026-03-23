// import React from 'react';
// import { useAuth } from '../hooks/useAuth';
// import DashboardStats from '../components/dashboard/DashboardStats';

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
//       <DashboardStats user={user} />
//       {/* Aquí puedes agregar más contenido como gráficos, tablas, etc. */}
//       <div className="bg-white p-6 rounded shadow">
//         <h3 className="text-lg font-semibold mb-2">Información del token</h3>
//         <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
//           {JSON.stringify(user, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardStats from '../components/dashboard/DashboardStats';
import { Shield, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Panel Gerencial</h2>
        <p className="text-gray-500 mt-1">Visión general del negocio y métricas clave</p>
      </div>

      <DashboardStats user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Actividad reciente</h3>
            <button className="text-sm text-primary-600 hover:underline">Ver todas</button>
          </div>
          <div className="space-y-3">
            {[
              { user: 'María González', action: 'Creó una nueva póliza', time: 'hace 5 minutos' },
              { user: 'Carlos Ruiz', action: 'Actualizó beneficiarios', time: 'hace 1 hora' },
              { user: 'Ana Torres', action: 'Generó reporte mensual', time: 'hace 3 horas' },
              { user: 'Luis Fernández', action: 'Aprobó cobertura', time: 'hace 5 horas' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información del usuario y permisos */}
        <div className="bg-white rounded-xl shadow-card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Perfil de acceso</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Usuario</p>
              <p className="text-sm font-medium">{user?.correo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Roles</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user?.roles.map((role, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Permisos destacados</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user?.permisos.slice(0, 4).map((perm, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {perm.replace('_', ' ')}
                  </span>
                ))}
                {/* {user?.permisos.length > 4 && (
                  <span className="text-xs text-gray-500">+{user.permisos.length - 4} más</span>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección adicional: pólizas próximas a vencer */}
      <div className="mt-6 bg-white rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Próximos vencimientos</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Póliza</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha vencimiento</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { cliente: 'Juan Pérez', poliza: 'VIDA-123', vencimiento: '2025-04-15', estado: 'Por renovar' },
                { cliente: 'María López', poliza: 'AUTO-456', vencimiento: '2025-04-20', estado: 'Al día' },
                { cliente: 'Carlos Ruiz', poliza: 'HOGAR-789', vencimiento: '2025-04-25', estado: 'Por renovar' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm text-gray-800">{row.cliente}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{row.poliza}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{row.vencimiento}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.estado === 'Por renovar' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {row.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;