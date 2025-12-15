import AttendanceClient from "./AttendanceClient";
import { History } from "lucide-react";

export default async function AttendancePage() {
    return (
        <div className="pb-24 bg-slate-50 min-h-screen">
            <header className="bg-white p-4 border-b border-slate-100 shadow-sm sticky top-0 z-50">
                <h1 className="text-xl font-bold text-slate-800 text-center flex items-center justify-center gap-2">
                    <History className="w-5 h-5 text-emerald-600" />
                    Absensi Digital
                </h1>
            </header>

            <AttendanceClient />
        </div>
    );
}
