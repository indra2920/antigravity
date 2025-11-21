import { getClasses, getLevels, createClass, deleteClass } from "../actions";
import MasterDataLayout from "@/components/MasterDataLayout";
import { Users } from "lucide-react";
import DeleteClassButton from "./DeleteClassButton";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClassesPage() {
    const [classes, levels] = await Promise.all([
        getClasses(),
        getLevels(),
    ]);

    async function handleDelete(formData: FormData) {
        "use server";
        const id = parseInt(formData.get("id") as string);
        await deleteClass(id);
    }

    return (
        <MasterDataLayout
            title="Data Kelas"
            description="Kelola kelas berdasarkan tingkatan"
        >
            {/* Add Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
                <h3 className="font-semibold text-slate-700 mb-4">Tambah Kelas Baru</h3>
                <form action={createClass} className="grid grid-cols-2 gap-3">
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Nama Kelas (IPA 1, IPS 2)"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                    <select
                        name="levelId"
                        required
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    >
                        <option value="">Pilih Tingkatan</option>
                        {levels.map((level) => (
                            <option key={level.id} value={level.id}>
                                Tingkat {level.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="col-span-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition"
                    >
                        Simpan
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="space-y-3">
                {classes.map((cls) => (
                    <div
                        key={cls.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{cls.name}</h3>
                                    <p className="text-xs text-slate-500">
                                        Tingkat {cls.level?.name} • {cls.students?.length || 0} Siswa
                                    </p>
                                </div>
                            </div>
                            <DeleteClassButton
                                classId={cls.id}
                                className={cls.name}
                                deleteAction={handleDelete}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </MasterDataLayout>
    );
}
