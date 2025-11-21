import { getStudents, getClasses, createStudent, seedInitialData } from "../actions";
import { UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function StudentsPage() {
    // Auto-seed for demo purposes if empty
    await seedInitialData();

    const students = await getStudents();
    const classes = await getClasses();

    return (
        <div className="p-6 pb-24">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Data Siswa</h1>
                <p className="text-slate-500 text-sm">Kelola data siswa Darulhuda</p>
            </header>

            {/* Add Student Form */}
            <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-emerald-600" />
                    Tambah Siswa
                </h2>
                <form action={createStudent} className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Nama Lengkap</label>
                        <input name="name" type="text" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500" placeholder="Contoh: Ahmad Rizky" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-600">NIS</label>
                            <input name="nis" type="text" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500" placeholder="2024..." />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">Kelas</label>
                            <select name="classId" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500">
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.level?.name} - {c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600">No. HP Orang Tua (WhatsApp)</label>
                        <input name="parentPhone" type="tel" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500" placeholder="08..." />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
                        Simpan Data
                    </button>
                </form>
            </section>

            {/* Student List */}
            <section>
                <h2 className="font-semibold text-slate-700 mb-3">Daftar Siswa ({students.length})</h2>
                <div className="space-y-3">
                    {students.map((student) => (
                        <div key={student.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {student.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-slate-800">{student.name}</h3>
                                <p className="text-xs text-slate-500">{student.nis} • {student.class?.name}</p>
                            </div>
                            <Link href={`/students/card/${student.id}`} className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition">
                                Kartu
                            </Link>
                        </div>
                    ))}
                    {students.length === 0 && (
                        <p className="text-center text-slate-400 text-sm py-4">Belum ada data siswa.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
