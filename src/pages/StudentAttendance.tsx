import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { supabase } from '../supabase';
import { format } from 'date-fns';
import { CheckCircle2, AlertCircle, Filter, Save } from 'lucide-react';
import { motion } from 'motion/react';

export default function StudentAttendancePage() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('students').select('*');
      if (data) {
        setStudents(data);
        const uniqueClasses = Array.from(new Set(data.map((s: any) => s.class_name)));
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = students.filter(s => s.class_name === selectedClass);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!profile) return;
    setLoading(true);
    setMessage(null);

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const records = filteredStudents.map(student => ({
        student_id: student.id,
        student_name: student.name,
        class_name: student.class_name,
        date: today,
        status: attendanceData[student.id] || 'present',
        teacher_id: profile.uid
      }));

      const { error } = await supabase.from('student_attendance').insert(records);
      if (error) throw error;

      setMessage({ type: 'success', text: `Berhasil menyimpan absensi kelas ${selectedClass}!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Absensi Siswa</h1>
          <p className="text-gray-500">Lakukan absensi harian untuk siswa di kelas Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field pl-10 pr-8 py-2 appearance-none bg-white"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || filteredStudents.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Simpan Absensi
          </button>
        </div>
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

      <div className="card overflow-hidden border-none shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">NIS</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.nis}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'present', label: 'Hadir', color: 'bg-green-100 text-green-700 border-green-200' },
                        { id: 'absent', label: 'Alpa', color: 'bg-red-100 text-red-700 border-red-200' },
                        { id: 'late', label: 'Terlambat', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                        { id: 'sick', label: 'Sakit', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                        { id: 'permission', label: 'Izin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                      ].map((status) => (
                        <button
                          key={status.id}
                          onClick={() => handleStatusChange(student.id, status.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                            (attendanceData[student.id] || 'present') === status.id
                              ? `${status.color} ring-2 ring-offset-1 ring-gray-200`
                              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data siswa untuk kelas ini.
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
