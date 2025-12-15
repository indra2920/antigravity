"use client";

import { Bell, QrCode, Users, GraduationCap, Calendar, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// Helper for relative time
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    return date.toLocaleDateString("id-ID");
}

export default function DashboardClient({ recentLogs }: { recentLogs: any[] }) {
    return (
        <div className="pb-24 min-h-screen">
            {/* Hero Header */}
            <header className="relative overflow-hidden bg-emerald-600 text-white rounded-b-[2.5rem] shadow-2xl pb-8 pt-6 px-6">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <p className="text-emerald-100 text-sm font-medium">Assalamualaikum,</p>
                            <h1 className="text-2xl font-bold tracking-tight">Admin Sekolah</h1>
                        </motion.div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg cursor-pointer hover:bg-white/30 transition relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-emerald-600"></span>
                        </div>
                    </div>

                    {/* Stats Carousel */}
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                        <div className="snap-center shrink-0 w-32 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2 mb-2 text-emerald-100">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-medium">Siswa Hadir</span>
                            </div>
                            <p className="text-3xl font-bold">85%</p>
                            <p className="text-[10px] text-emerald-200 mt-1">↑ 2% dari kemarin</p>
                        </div>

                        <div className="snap-center shrink-0 w-32 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2 mb-2 text-emerald-100">
                                <GraduationCap className="w-4 h-4" />
                                <span className="text-xs font-medium">Guru Hadir</span>
                            </div>
                            <p className="text-3xl font-bold">92%</p>
                            <p className="text-[10px] text-emerald-200 mt-1">Full Team</p>
                        </div>

                        <div className="snap-center shrink-0 w-32 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2 mb-2 text-emerald-100">
                                <Activity className="w-4 h-4" />
                                <span className="text-xs font-medium">Izin/Sakit</span>
                            </div>
                            <p className="text-3xl font-bold">12</p>
                            <p className="text-[10px] text-emerald-200 mt-1">Siswa</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-6 -mt-6 relative z-20">
                {/* Quick Actions Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="bg-white rounded-3xl shadow-xl p-6 mb-8"
                >
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Menu Utama</h2>
                    <div className="grid grid-cols-4 gap-4">
                        <Link href="/attendance" className="group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-200">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-600 transition">Absen</span>
                            </div>
                        </Link>

                        <Link href="/students" className="group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-200">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition">Siswa</span>
                            </div>
                        </Link>

                        <Link href="/teachers" className="group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-200">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 group-hover:text-amber-600 transition">Guru</span>
                            </div>
                        </Link>

                        <Link href="/schedule" className="group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-200">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-slate-600 group-hover:text-purple-600 transition">Jadwal</span>
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Recent Activity Feed */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="font-bold text-slate-800 text-lg">Aktivitas Terkini</h2>
                        <Link href="/report" className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentLogs.length > 0 ? (
                            recentLogs.map((log: any) => (
                                <div
                                    key={log.id}
                                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100"
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${log.role === 'Siswa' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                        {log.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-slate-800">
                                            {log.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {log.role}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mb-1">
                                            Hadir
                                        </span>
                                        <span suppressHydrationWarning className="text-[10px] text-slate-400">{timeAgo(log.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">
                                Belum ada aktivitas.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
