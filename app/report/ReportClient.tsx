"use client";

import { useState, useEffect } from "react";
import { Calendar, Download, FileText, Filter, Printer, Search } from "lucide-react";
import ExcelUtils from "@/components/ExcelUtils";
import { getAttendanceReport } from "./actions";

export default function ReportClient() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [filterRole, setFilterRole] = useState("ALL"); // ALL, Siswa, Guru

    useEffect(() => {
        fetchReport();
    }, [date]);

    const fetchReport = async () => {
        setLoading(true);
        const result = await getAttendanceReport(date);
        if (result.success) {
            setLogs(result.data || []);
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        if (filterRole === "ALL") return true;
        return log.role === filterRole;
    });

    // Stats
    const totalPresent = filteredLogs.length;
    const totalStudents = filteredLogs.filter(l => l.role === 'Siswa').length;
    const totalTeachers = filteredLogs.filter(l => l.role === 'Guru').length;

    // Export Handler
    const handleExport = () => {
        return filteredLogs.map((log, index) => ({
            'No': index + 1,
            'Waktu': new Date(log.createdAt).toLocaleTimeString('id-ID'),
            'Nama': log.name,
            'Role': log.role,
            'NIS/NIP': log.nis_nip,
            'Kelas': log.className,
            'Status': 'Hadir', // Currently everything is 'Hadir' (Present)
            'Metode': log.method
        }));
    };

    const templateColumns = [
        { header: 'No', key: 'No', width: 5 },
        { header: 'Waktu', key: 'Waktu', width: 10 },
        { header: 'Nama', key: 'Nama', width: 25 },
        { header: 'Role', key: 'Role', width: 10 },
        { header: 'NIS/NIP', key: 'NIS/NIP', width: 15 },
        { header: 'Kelas', key: 'Kelas', width: 10 },
        { header: 'Status', key: 'Status', width: 10 },
        { header: 'Metode', key: 'Metode', width: 10 },
    ];

    return (
        <div className="space-y-6">
            {/* Header / Filter Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    >
                        <option value="ALL">Semua Role</option>
                        <option value="Siswa">Siswa</option>
                        <option value="Guru">Guru</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <ExcelUtils
                        onImport={async () => { }} // Import not needed here
                        onExport={handleExport}
                        templateColumns={templateColumns}
                        filename={`Laporan_Absensi_${date}`}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200">
                    <p className="text-emerald-100 text-sm font-medium mb-1">Total Kehadiran</p>
                    <h3 className="text-3xl font-bold">{totalPresent}</h3>
                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100 bg-white/20 px-3 py-1 rounded-lg w-fit">
                        <FileText className="w-3 h-3" />
                        {new Date(date).toLocaleDateString("id-ID", { dateStyle: 'full' })}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1">Siswa Hadir</p>
                    <h3 className="text-3xl font-bold text-slate-800">{totalStudents}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium mb-1">Guru Hadir</p>
                    <h3 className="text-3xl font-bold text-slate-800">{totalTeachers}</h3>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Detail Kehadiran</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {filteredLogs.length} Data
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Memuat data laporan...
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        Tidak ada data kehadiran pada tanggal ini.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-mono text-slate-600">
                                            {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-800">{log.name}</div>
                                            <div className="text-xs text-slate-400">{log.nis_nip}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${log.role === 'Siswa' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {log.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Hadir
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {log.className !== '-' ? `Kelas ${log.className}` : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
