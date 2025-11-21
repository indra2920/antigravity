"use client";
import { Home, FileText, ScanLine, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function BottomNav() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="px-4 pb-4 pt-2">
            <nav className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl shadow-slate-200/50">
                <Link href="/" className={clsx("flex flex-col items-center gap-1 transition relative p-2", isActive("/") ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600")}>
                    {isActive("/") && <motion.div layoutId="nav-indicator" className="absolute -top-3 w-1 h-1 bg-emerald-600 rounded-full" />}
                    <Home className="w-6 h-6" />
                </Link>

                <Link href="/report" className={clsx("flex flex-col items-center gap-1 transition relative p-2", isActive("/report") ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600")}>
                    {isActive("/report") && <motion.div layoutId="nav-indicator" className="absolute -top-3 w-1 h-1 bg-emerald-600 rounded-full" />}
                    <FileText className="w-6 h-6" />
                </Link>

                <Link href="/attendance" className="relative group">
                    <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl -mt-12 flex items-center justify-center shadow-lg shadow-emerald-200 border-4 border-slate-50 text-white transform transition duration-300 group-active:scale-95 group-hover:-translate-y-1">
                        <ScanLine className="w-7 h-7" />
                    </div>
                </Link>

                <Link href="/notifications" className={clsx("flex flex-col items-center gap-1 transition relative p-2", isActive("/notifications") ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600")}>
                    {isActive("/notifications") && <motion.div layoutId="nav-indicator" className="absolute -top-3 w-1 h-1 bg-emerald-600 rounded-full" />}
                    <Bell className="w-6 h-6" />
                </Link>

                <Link href="/profile" className={clsx("flex flex-col items-center gap-1 transition relative p-2", isActive("/profile") ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600")}>
                    {isActive("/profile") && <motion.div layoutId="nav-indicator" className="absolute -top-3 w-1 h-1 bg-emerald-600 rounded-full" />}
                    <User className="w-6 h-6" />
                </Link>
            </nav>
        </div>
    );
}
