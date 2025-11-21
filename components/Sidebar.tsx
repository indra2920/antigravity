"use client";
import { Home, FileText, ScanLine, Users, GraduationCap, Calendar, LogOut, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Sidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "/" },
        { icon: ScanLine, label: "Absensi", href: "/attendance" },
        { icon: FileText, label: "Laporan", href: "/report" },
        { icon: Settings, label: "Pengaturan", href: "/settings" },
    ];

    const masterDataItems = [
        { icon: Users, label: "Data Siswa", href: "/master/students" },
        { icon: GraduationCap, label: "Data Guru", href: "/master/teachers" },
        { icon: BookOpen, label: "Kelas", href: "/master/classes" },
        { icon: Calendar, label: "Tingkatan", href: "/master/levels" },
        { icon: BookOpen, label: "Mata Pelajaran", href: "/master/subjects" },
    ];

    return (
        <aside className="h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200 p-6 flex flex-col shadow-2xl relative z-50 overflow-y-auto">
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">
                    D
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Darulhuda</h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">School System</p>
                </div>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="relative group block"
                    >
                        {isActive(item.href) && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-emerald-50 rounded-xl"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <div className={clsx(
                            "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 font-medium",
                            isActive(item.href)
                                ? "text-emerald-700"
                                : "text-slate-500 hover:text-emerald-600 hover:bg-slate-50/50"
                        )}>
                            <item.icon className={clsx("w-5 h-5 transition-transform duration-200", isActive(item.href) ? "scale-110" : "group-hover:scale-110")} />
                            {item.label}
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Master Data Section */}
            <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Master Data</p>
                <nav className="space-y-1">
                    {masterDataItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group block"
                        >
                            {isActive(item.href) && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-emerald-50 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className={clsx(
                                "relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200 font-medium text-sm",
                                isActive(item.href)
                                    ? "text-emerald-700"
                                    : "text-slate-500 hover:text-emerald-600 hover:bg-slate-50/50"
                            )}>
                                <item.icon className={clsx("w-4 h-4 transition-transform duration-200", isActive(item.href) ? "scale-110" : "group-hover:scale-110")} />
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition group">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
