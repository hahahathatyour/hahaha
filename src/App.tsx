/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { UserProfile } from './types';
import { User } from '@supabase/supabase-js';
import { AlertCircle } from 'lucide-react';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import StudentAttendancePage from './pages/StudentAttendance';
import AttendanceReport from './pages/AttendanceReport';
import StudentManagement from './pages/StudentManagement';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    
    if (data) {
      setProfile({
        uid: data.id,
        email: data.email,
        displayName: data.display_name,
        role: data.role,
        createdAt: data.created_at
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if Supabase is configured
  const isSupabaseConfigured = (() => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    const isValid = (v: any) => v && v !== 'undefined' && v !== 'null' && v !== '';
    return isValid(url) && isValid(key) && String(url).startsWith('http');
  })();

  if (!isSupabaseConfigured && !demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Konfigurasi Supabase Belum Lengkap</h2>
          <p className="text-gray-600">
            Aplikasi ini memerlukan kredensial Supabase untuk berfungsi. Silakan tambahkan variabel berikut di panel <strong>Secrets</strong> (ikon gembok di kiri):
          </p>
          <ul className="text-left bg-gray-50 p-4 rounded-lg text-sm font-mono space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" /> VITE_SUPABASE_URL
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" /> VITE_SUPABASE_ANON_KEY
            </li>
          </ul>
          
          <div className="pt-4 space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Sudah Tambah? Muat Ulang
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Atau</span></div>
            </div>

            <button 
              onClick={() => setDemoMode(true)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Coba Mode Demo (Tanpa Database)
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            Catatan: Dalam Mode Demo, data tidak akan tersimpan secara permanen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/app" /> : <Login />} />
          
          <Route path="/app" element={user ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="absensi-karyawan" element={<EmployeeAttendance />} />
            
            {/* Guru & Admin */}
            {(profile?.role === 'guru' || profile?.role === 'admin') && (
              <>
                <Route path="absensi-siswa" element={<StudentAttendancePage />} />
                <Route path="rekap-absensi-siswa" element={<AttendanceReport type="siswa" />} />
              </>
            )}

            {/* Admin Only */}
            {profile?.role === 'admin' && (
              <>
                <Route path="rekap-absensi-karyawan" element={<AttendanceReport type="karyawan" />} />
                <Route path="data-siswa" element={<StudentManagement />} />
                <Route path="user-management" element={<UserManagement />} />
              </>
            )}
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
