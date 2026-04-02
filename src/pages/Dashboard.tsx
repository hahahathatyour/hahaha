import { useAuth } from '../App';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Calendar,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployees: 0,
    todayAttendance: 0,
    studentAttendance: 0
  });
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      // Total Students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      const { count: employeeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Today Employee Attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const { count: attendanceCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      // Today Student Attendance
      const { count: studentAttendanceCount } = await supabase
        .from('student_attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      setStats({
        totalStudents: studentCount || 0,
        totalEmployees: employeeCount || 0,
        todayAttendance: attendanceCount || 0,
        studentAttendance: studentAttendanceCount || 0
      });

      // Recent Attendance
      const { data: recentData } = await supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentAttendance(recentData || []);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali, {profile?.displayName}. Berikut ringkasan hari ini.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Siswa', value: stats.totalStudents, icon: <GraduationCap />, color: 'bg-blue-500' },
          { label: 'Total Karyawan', value: stats.totalEmployees, icon: <Users />, color: 'bg-purple-500' },
          { label: 'Absensi Karyawan', value: stats.todayAttendance, icon: <UserCheck />, color: 'bg-primary' },
          { label: 'Absensi Siswa', value: stats.studentAttendance, icon: <Calendar />, color: 'bg-secondary' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card flex items-center gap-4"
          >
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Aktivitas Absensi Terbaru</h3>
              <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                Lihat Semua <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentAttendance.length > 0 ? recentAttendance.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary border border-gray-200">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.user_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.role} • {item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.created_at ? format(new Date(item.created_at), 'HH:mm') : '--:--'}
                    </p>
                    <p className="text-xs text-gray-500">WIB</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-8">Belum ada aktivitas hari ini.</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <div className="card bg-primary text-white border-none">
            <h3 className="text-lg font-bold mb-4">Informasi Sekolah</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Jam Kerja</p>
                  <p className="text-xs text-red-100">Senin - Jumat: 07:00 - 15:30</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Hari Ini</p>
                  <p className="text-xs text-red-100">{format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-secondary/30 bg-secondary/5">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pengingat</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pastikan melakukan absensi tepat waktu. Guru diwajibkan mengabsen siswa setiap jam pelajaran pertama.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
