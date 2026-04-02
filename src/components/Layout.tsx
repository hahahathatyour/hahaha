import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { supabase } from '../supabase';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  UserCog, 
  LogOut, 
  GraduationCap,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export default function Layout() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: <LayoutDashboard />, roles: ['admin', 'guru', 'staf'] },
    { name: 'Absensi Mandiri', path: '/app/absensi-karyawan', icon: <UserCheck />, roles: ['admin', 'guru', 'staf'] },
    { name: 'Absensi Siswa', path: '/app/absensi-siswa', icon: <Users />, roles: ['admin', 'guru'] },
    { name: 'Rekap Siswa', path: '/app/rekap-absensi-siswa', icon: <FileText />, roles: ['admin', 'guru'] },
    { name: 'Rekap Karyawan', path: '/app/rekap-absensi-karyawan', icon: <FileText />, roles: ['admin'] },
    { name: 'Data Siswa', path: '/app/data-siswa', icon: <GraduationCap />, roles: ['admin'] },
    { name: 'User Management', path: '/app/user-management', icon: <UserCog />, roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(profile?.role || ''));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl lg:relative"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg tracking-tight">Prima Unggul</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                  <X />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-1">
                {filteredMenu.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                      location.pathname === item.path
                        ? "bg-primary text-white shadow-md shadow-red-200"
                        : "text-gray-600 hover:bg-red-50 hover:text-primary"
                    )}
                  >
                    <span className={clsx(
                      "w-5 h-5 transition-colors",
                      location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-primary"
                    )}>
                      {item.icon}
                    </span>
                    {item.name}
                    {location.pathname === item.path && (
                      <ChevronRight className="ml-auto w-4 h-4" />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <div className="bg-red-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Role Anda</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{profile?.role}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className={clsx("p-2 text-gray-500 hover:bg-gray-100 rounded-lg", isSidebarOpen && "lg:hidden")}
          >
            <Menu />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{profile?.displayName}</p>
              <p className="text-xs text-gray-500">{profile?.email}</p>
            </div>
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold shadow-inner">
              {profile?.displayName?.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
