import { getTeachers, createTeacher } from "../actions";
import { GraduationCap, UserPlus } from "lucide-react";

export default async function TeachersPage() {
    const teachers = await getTeachers();

    return (
        <div className="p-6 pb-24">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Data Guru</h1>
                <p className="text-slate-500 text-sm">Kelola data guru & staf</p>
            </header>

            {/* Add Teacher Form */}
            <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-600" />
                    Tambah Guru
                </h2>
                <form action={createTeacher} className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-slate-600">Nama Lengkap</label>
                        <input name="name" type="text" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500" placeholder="Contoh: Budi Santoso, S.Pd" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-600">NIP</label>
                            <input name="nip" type="text" required className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500" placeholder="198..." />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">No. HP</label>
                            <input name="phone" type="tel" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500" placeholder="08..." />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition">
                        Simpan Data
                    </button>
                </form>
            </section>

            {/* Teacher List */}
            <section>
                <h2 className="font-semibold text-slate-700 mb-3">Daftar Guru ({teachers.length})</h2>
                <div className="space-y-3">
                    {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">
                                {teacher.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-slate-800">{teacher.name}</h3>
                                <p className="text-xs text-slate-500">{teacher.nip}</p>
                            </div>
                        </div>
                    ))}
                    {teachers.length === 0 && (
                        <p className="text-center text-slate-400 text-sm py-4">Belum ada data guru.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
