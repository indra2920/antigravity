import { FileText } from "lucide-react";
import ReportClient from "./ReportClient";

export default function ReportPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-sm mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800">Laporan Kehadiran</h1>
                        <p className="text-xs text-slate-500">Rekapitulasi Absensi Harian</p>
                    </div>
                </div>
            </header>

            <div className="px-6">
                <ReportClient />
            </div>
        </div>
    );
}
