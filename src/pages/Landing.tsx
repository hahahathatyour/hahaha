import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Monitor, Code, Palette, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                SMK <span className="text-primary">Prima Unggul</span>
              </span>
            </div>
            <Link to="/login" className="btn-primary">
              Masuk ke Aplikasi
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6"
          >
            Membangun Masa Depan <br />
            <span className="text-primary">Cerdas & Berkarakter</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            SMK Prima Unggul adalah lembaga pendidikan kejuruan yang berfokus pada pengembangan 
            kompetensi teknologi dan kreativitas untuk menghadapi tantangan industri global.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/login" className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
              Mulai Absensi <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Keahlian Unggulan</h2>
            <p className="text-gray-600">Kami menawarkan 3 jurusan yang paling dibutuhkan di era digital saat ini.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'TKJ',
                fullName: 'Teknik Komputer & Jaringan',
                desc: 'Mempelajari instalasi jaringan, administrasi server, dan keamanan infrastruktur IT.',
                icon: <Monitor className="w-8 h-8 text-white" />,
                color: 'bg-blue-600'
              },
              {
                title: 'RPL',
                fullName: 'Rekayasa Perangkat Lunak',
                desc: 'Fokus pada pengembangan aplikasi web, mobile, dan pemecahan masalah melalui pemrograman.',
                icon: <Code className="w-8 h-8 text-white" />,
                color: 'bg-primary'
              },
              {
                title: 'Multimedia',
                fullName: 'Desain Komunikasi Visual',
                desc: 'Mengembangkan kreativitas dalam desain grafis, videografi, fotografi, dan animasi digital.',
                icon: <Palette className="w-8 h-8 text-white" />,
                color: 'bg-secondary'
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="card border-none shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm font-semibold text-primary mb-4">{item.fullName}</p>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="text-secondary w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight">
                  SMK <span className="text-secondary">Prima Unggul</span>
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Mencetak generasi unggul yang siap kerja dan berdaya saing tinggi di industri teknologi.
              </p>
            </div>
            <div className="flex justify-md-end gap-8">
              <div>
                <h4 className="font-bold mb-4 text-secondary">Kontak Kami</h4>
                <p className="text-gray-400 text-sm">Jl. Pendidikan No. 123, Kota Digital</p>
                <p className="text-gray-400 text-sm">info@smkprimaunggul.sch.id</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SMK Prima Unggul. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
