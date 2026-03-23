// // import React from 'react';
// // import { Outlet } from 'react-router-dom';
// // import Sidebar from './Sidebar';
// // import Header from './Header';

// // const Layout: React.FC = () => {
// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       <Sidebar />
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         <Header />
// //         {/* <main className="flex-1 overflow-y-auto p-6">
// //           <Outlet />
// //         </main> */}
       
// // <main className="flex-1 overflow-y-auto">
// //   <Outlet />
// // </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;

// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';

// const Layout: React.FC = () => {
//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
// import { Menu } from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;