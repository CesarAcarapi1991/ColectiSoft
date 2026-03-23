// // // import React from 'react';
// // // import { useAuth } from '../../hooks/useAuth';
// // // import Button from '../common/Button';

// // // const Header: React.FC = () => {
// // //   const { user, logout } = useAuth();

// // //   return (
// // //     <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
// // //       <h1 className="text-xl font-semibold text-gray-800">Panel de Control</h1>
// // //       <div className="flex items-center space-x-4">
// // //         {user && (
// // //           <span className="text-sm text-gray-600">
// // //             {user.correo}
// // //           </span>
// // //         )}
// // //         <Button variant="outline" size="sm" onClick={logout}>
// // //           Cerrar sesión
// // //         </Button>
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // export default Header;

// // import React from 'react';
// // import { useAuth } from '../../hooks/useAuth';
// // import { Bell, User } from 'lucide-react';

// // const Header: React.FC = () => {
// //   const { user } = useAuth();

// //   return (
// //     <header className="bg-white border-b border-gray-200 px-6 py-3">
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h1 className="text-xl font-semibold text-gray-800">Bienvenido, {user?.correo.split('@')[0]}</h1>
// //           <p className="text-sm text-gray-500">Panel de control gerencial</p>
// //         </div>
// //         <div className="flex items-center space-x-4">
// //           <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
// //             <Bell className="w-5 h-5" />
// //             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
// //           </button>
// //           <div className="flex items-center space-x-2">
// //             <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
// //               <User className="w-4 h-4 text-primary-600" />
// //             </div>
// //             <span className="text-sm font-medium text-gray-700">{user?.correo.split('@')[0]}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;

// import React from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { Bell, User, Menu } from 'lucide-react';

// interface HeaderProps {
//   onMenuClick: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
//   const { user } = useAuth();

//   return (
//     <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-lg md:text-xl font-semibold text-gray-800">
//               Bienvenido, {user?.correo.split('@')[0]}
//             </h1>
//             <p className="text-xs md:text-sm text-gray-500">Panel de control gerencial</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-3 md:space-x-4">
//           <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
//             <Bell className="w-5 h-5" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
//               <User className="w-4 h-4 text-primary-600" />
//             </div>
//             <span className="hidden md:inline text-sm font-medium text-gray-700">
//               {user?.correo.split('@')[0]}
//             </span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Botón hamburguesa solo visible en móvil */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              Bienvenido, {user?.correo.split('@')[0]}
            </h1>
            <p className="text-xs md:text-sm text-gray-500">Panel de control gerencial</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {user?.correo.split('@')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;