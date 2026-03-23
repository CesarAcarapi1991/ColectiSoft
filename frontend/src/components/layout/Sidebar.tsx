// // import React from 'react';
// // import { NavLink } from 'react-router-dom';
// // import { useAuth } from '../../hooks/useAuth';

// // const Sidebar: React.FC = () => {
// //   const { user } = useAuth();

// //   const navItems = [
// //     { name: 'Dashboard', path: '/dashboard', icon: '📊' },
// //     { name: 'Usuarios', path: '/usuarios', icon: '👥' },
// //     { name: 'Empresas', path: '/empresas', icon: '🏢' },
// //     { name: 'Productos', path: '/productos', icon: '📦' },
// //     { name: 'Coberturas', path: '/coberturas', icon: '🛡️' },
// //     { name: 'Asegurados', path: '/asegurados', icon: '👤' },
// //     { name: 'Beneficiarios', path: '/beneficiarios', icon: '👪' },
// //   ];

// //   return (
// //     <aside className="w-64 bg-gray-800 text-white flex flex-col">
// //       <div className="p-4 text-xl font-bold border-b border-gray-700">
// //         Seguros App
// //       </div>
// //       <nav className="flex-1 mt-4">
// //         {navItems.map((item) => (
// //           <NavLink
// //             key={item.path}
// //             to={item.path}
// //             className={({ isActive }) =>
// //               `flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition ${
// //                 isActive ? 'bg-gray-700 text-white' : ''
// //               }`
// //             }
// //           >
// //             <span className="mr-2">{item.icon}</span>
// //             {item.name}
// //           </NavLink>
// //         ))}
// //       </nav>
// //       <div className="p-4 border-t border-gray-700 text-sm">
// //         {user && (
// //           <div>
// //             <p className="font-medium">{user.correo}</p>
// //             <p className="text-gray-400 text-xs">Roles: {user.roles.join(', ')}</p>
// //           </div>
// //         )}
// //       </div>
// //     </aside>
// //   );
// // };

// // export default Sidebar;

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Building2, 
//   Package, 
//   Shield, 
//   UserCheck, 
//   Users2, 
//   LogOut 
// } from 'lucide-react';

// const Sidebar: React.FC = () => {
//   const { user, logout } = useAuth();

//   const navItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
//     { name: 'Usuarios', path: '/usuarios', icon: Users },
//     { name: 'Empresas', path: '/empresas', icon: Building2 },
//     { name: 'Productos', path: '/productos', icon: Package },
//     { name: 'Coberturas', path: '/coberturas', icon: Shield },
//     { name: 'Asegurados', path: '/asegurados', icon: UserCheck },
//     { name: 'Beneficiarios', path: '/beneficiarios', icon: Users2 },
//   ];

//   return (
//     <aside className="w-64 bg-navy-800 text-white flex flex-col shadow-lg">
//       <div className="p-5 border-b border-navy-700">
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-lg">S</span>
//           </div>
//           <span className="text-xl font-semibold tracking-wide">SegurosPro</span>
//         </div>
//         <p className="text-xs text-gray-400 mt-1">Plataforma Gerencial</p>
//       </div>
      
//       <nav className="flex-1 mt-6 px-3">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center px-3 py-2.5 rounded-lg mb-1 transition-colors ${
//                 isActive
//                   ? 'bg-primary-600 text-white'
//                   : 'text-gray-300 hover:bg-navy-700 hover:text-white'
//               }`
//             }
//           >
//             <item.icon className="w-5 h-5 mr-3" />
//             <span className="text-sm font-medium">{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>
      
//       <div className="p-4 border-t border-navy-700">
//         {user && (
//           <div className="flex items-center space-x-3 mb-3">
//             <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
//               <span className="text-sm font-semibold">{user.correo.charAt(0).toUpperCase()}</span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium truncate">{user.correo}</p>
//               <p className="text-xs text-gray-400 truncate">{user.roles.join(', ')}</p>
//             </div>
//           </div>
//         )}
//         <button
//           onClick={logout}
//           className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-navy-700 hover:text-white transition-colors"
//         >
//           <LogOut className="w-4 h-4 mr-3" />
//           Cerrar sesión
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Package, 
  Shield, 
  UserCheck, 
  Users2, 
  LogOut,
  X,
  FileText,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Usuarios', path: '/usuarios', icon: Users },
    { name: 'Empresas', path: '/empresas', icon: Building2 },
    { name: 'Productos', path: '/productos', icon: Package },
    { name: 'Coberturas', path: '/coberturas', icon: Shield },
    { name: 'Asegurados', path: '/asegurados', icon: UserCheck },
    { name: 'Beneficiarios', path: '/beneficiarios', icon: Users2 },
    { name: 'Solicitudes', path: '/solicitudes', icon: FileText },
    { name: 'Caja', path: '/caja', icon: CreditCard },
  ];

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-navy-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-semibold tracking-wide">SegurosPro</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-400 px-5 pt-2">Plataforma Gerencial</p>
      
      <nav className="flex-1 mt-6 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-navy-700">
        {user && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-sm font-semibold">{user.correo.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.correo}</p>
              <p className="text-xs text-gray-400 truncate">{user.roles.join(', ')}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-navy-700 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  // Para desktop, siempre visible
  // Para móvil, se muestra como overlay con transición
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-navy-800 text-white flex-shrink-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-navy-800 text-white shadow-xl z-50 animate-slide-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;