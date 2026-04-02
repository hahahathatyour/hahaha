import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'motion/react';
import { MapPin, Clock, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';

export default function EmployeeAttendance() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchTodayRecords = async () => {
    if (!profile) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', profile.uid)
      .eq('date', today)
      .order('created_at', { ascending: false });
    
    setTodayRecords(data || []);
  };

  useEffect(() => {
    fetchTodayRecords();
  }, [profile]);

  const handleAttendance = async (type: 'check-in' | 'check-out') => {
    if (!profile) return;
    setLoading(true);
    setMessage(null);

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Check if already checked in/out
      const existing = todayRecords.find(r => r.type === type);
      if (existing) {
        throw new Error(`Anda sudah melakukan ${type} hari ini.`);
      }

      const { error } = await supabase
        .from('attendance')
        .insert({
          user_id: profile.uid,
          user_name: profile.displayName,
          role: profile.role,
          date: today,
          type: type
        });

      if (error) throw error;

      setMessage({ type: 'success', text: `Berhasil melakukan ${type}!` });
      fetchTodayRecords();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const hasCheckIn = todayRecords.some(r => r.type === 'check-in');
  const hasCheckOut = todayRecords.some(r => r.type === 'check-out');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Absensi Mandiri</h1>
        <p className="text-gray-500">Silakan lakukan absensi kehadiran Anda hari ini.</p>
      </header>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Check In Card */}
        <div className="card text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Masuk Kerja</h3>
            <p className="text-sm text-gray-500">Lakukan absensi saat mulai bekerja.</p>
          </div>
          <button
            onClick={() => handleAttendance('check-in')}
            disabled={loading || hasCheckIn}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              hasCheckIn 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'
            }`}
          >
            {hasCheckIn ? 'Sudah Absen Masuk' : 'Absen Masuk'}
          </button>
        </div>

        {/* Check Out Card */}
        <div className="card text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <LogOut className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pulang Kerja</h3>
            <p className="text-sm text-gray-500">Lakukan absensi saat selesai bekerja.</p>
          </div>
          <button
            onClick={() => handleAttendance('check-out')}
            disabled={loading || !hasCheckIn || hasCheckOut}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              hasCheckOut || !hasCheckIn
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100'
            }`}
          >
            {hasCheckOut ? 'Sudah Absen Pulang' : 'Absen Pulang'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Riwayat Hari Ini</h3>
        <div className="space-y-4">
          {todayRecords.length > 0 ? todayRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${record.type === 'check-in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {record.type === 'check-in' ? <Clock className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 capitalize">{record.type === 'check-in' ? 'Masuk' : 'Pulang'}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> SMK Prima Unggul
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {record.created_at ? format(new Date(record.created_at), 'HH:mm:ss') : '--:--:--'}
                </p>
                <p className="text-xs text-gray-500">WIB</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada riwayat absensi hari ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
