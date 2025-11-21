import { getLevels, createLevel, deleteLevel, seedInitialData } from "../actions";
import LevelsClient from "./LevelsClient";
import MasterDataLayout from "@/components/MasterDataLayout";

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LevelsPage() {
    await seedInitialData();
    const levels = await getLevels();

    async function handleDelete(formData: FormData) {
        "use server";
        const id = parseInt(formData.get("id") as string);
        await deleteLevel(id);
    }

    return (
        <MasterDataLayout
            title="Data Tingkatan"
            description="Kelola tingkatan kelas (X, XI, XII)"
        >
            {/* Add Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
                <h3 className="font-semibold text-slate-700 mb-4">Tambah Tingkatan Baru</h3>
                <form action={createLevel} className="flex gap-3">
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Contoh: X, XI, XII"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                    <button
                        type="submit"
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition"
                    >
                        Simpan
                    </button>
                </form>
            </div>

            {/* List */}
            <LevelsClient levels={levels} deleteAction={handleDelete} />
        </MasterDataLayout>
    );
}
