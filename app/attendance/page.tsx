import AttendanceClient from "./AttendanceClient";

export default function AttendancePage() {
    return (
        <div className="pb-24">
            <header className="bg-white p-4 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-800 text-center">Absensi Digital</h1>
            </header>
            <AttendanceClient />
        </div>
    );
}
