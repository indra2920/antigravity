"use client";

import { useState } from "react";
import { Users, Edit2, Trash2, Check, X } from "lucide-react";
import { createClass, deleteClass, updateClass } from "../actions";

export default function ClassesClient({ classes, levels }: { classes: any[], levels: any[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            await deleteClass(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Add Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
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
                        {editingId === cls.id ? (
                            <form
                                action={async (formData) => {
                                    await updateClass(cls.id, formData);
                                    setEditingId(null);
                                }}
                                className="flex items-center gap-3 w-full"
                            >
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input
                                        name="name"
                                        defaultValue={cls.name}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500"
                                        placeholder="Nama Kelas"
                                    />
                                    <select
                                        name="levelId"
                                        defaultValue={cls.levelId}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500"
                                    >
                                        {levels.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-1">
                                    <button type="submit" className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
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
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingId(cls.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cls.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
