// import React from 'react';
// import Card from '../common/Card';

// interface DashboardStatsProps {
//   user: any;
// }

// const DashboardStats: React.FC<DashboardStatsProps> = ({ user }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//       <Card className="text-center">
//         <h3 className="text-gray-500 text-sm">Bienvenido</h3>
//         <p className="text-2xl font-bold">{user?.correo}</p>
//       </Card>
//       <Card className="text-center">
//         <h3 className="text-gray-500 text-sm">Roles</h3>
//         <p className="text-2xl font-bold">{user?.roles?.length || 0}</p>
//         <p className="text-xs text-gray-600">{user?.roles?.join(', ')}</p>
//       </Card>
//       <Card className="text-center">
//         <h3 className="text-gray-500 text-sm">Permisos</h3>
//         <p className="text-2xl font-bold">{user?.permisos?.length || 0}</p>
//         <p className="text-xs text-gray-600 truncate">{user?.permisos?.slice(0, 3).join(', ')}...</p>
//       </Card>
//       <Card className="text-center">
//         <h3 className="text-gray-500 text-sm">Estado</h3>
//         <p className="text-2xl font-bold text-green-600">Activo</p>
//       </Card>
//     </div>
//   );
// };

// export default DashboardStats;

import React from 'react';
import { Users, Building2, FileText, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  user: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ user }) => {
  // Datos estáticos de ejemplo para mostrar estadísticas
  const stats = [
    { title: 'Clientes', value: '2,345', icon: Users, change: '+12%', color: 'bg-blue-500' },
    { title: 'Empresas', value: '48', icon: Building2, change: '+3', color: 'bg-green-500' },
    { title: 'Pólizas activas', value: '1,287', icon: FileText, change: '+8%', color: 'bg-purple-500' },
    { title: 'Primas totales', value: '$2.4M', icon: DollarSign, change: '+18%', color: 'bg-amber-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change} respecto al mes anterior</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;