import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { Download, Calendar } from 'lucide-react';

interface Props {
  type: 'siswa' | 'karyawan';
}

export default function AttendanceReport({ type }: Props) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchRecords = async () => {
    setLoading(false);
    const tableName = type === 'siswa' ? 'student_attendance' : 'attendance';
    const { data } = await supabase
      .from(tableName)
      .select('*')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false });
    
    setRecords(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, type]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rekap Absensi {type === 'siswa' ? 'Siswa' : 'Karyawan'}</h1>
          <p className="text-gray-500">Laporan kehadiran harian SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field pl-10 py-2"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="card overflow-hidden border-none shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {type === 'siswa' ? 'Nama Siswa' : 'Nama Karyawan'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {type === 'siswa' ? 'Kelas' : 'Role'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status / Tipe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {type === 'siswa' ? record.student_name : record.user_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {type === 'siswa' ? (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">{record.class_name}</span>
                    ) : (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold capitalize">{record.role}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {record.created_at ? format(new Date(record.created_at), 'HH:mm:ss') : '--:--:--'}
                  </td>
                  <td className="px-6 py-4">
                    {type === 'siswa' ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        record.status === 'present' ? 'bg-green-50 text-green-700 border-green-100' :
                        record.status === 'absent' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {record.status === 'present' ? 'Hadir' : 
                         record.status === 'absent' ? 'Alpa' : 
                         record.status === 'sick' ? 'Sakit' : 
                         record.status === 'late' ? 'Terlambat' : 'Izin'}
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        record.type === 'check-in' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {record.type === 'check-in' ? 'Masuk' : 'Pulang'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'Memuat data...' : 'Tidak ada data absensi untuk tanggal ini.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
