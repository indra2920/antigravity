"use client";

import { useState } from "react";
import ExcelUtils from "@/components/ExcelUtils";
import { Trash2, BookMarked, Edit2, Check, X } from "lucide-react";
import { createSubject, deleteSubject, updateSubject } from "../actions";
import { bulkImportSubjects } from "../bulk-actions";

export default function SubjectsClient({ subjects }: { subjects: any[] }) {
    const [importing, setImporting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleImport = async (data: any[]) => {
        setImporting(true);
        const result = await bulkImportSubjects(data);
        if (result.success) {
            alert(`Berhasil import ${result.count} mata pelajaran!`);
            window.location.reload();
        } else {
            alert(`Error: ${result.error}`);
        }
        setImporting(false);
    };

    const handleExport = () => {
        return subjects.map(s => ({
            'Nama Mata Pelajaran': s.name,
            'Jumlah Guru': s.teachers?.length || 0,
        }));
    };

    const templateColumns = [
        { header: 'Nama Mata Pelajaran', key: 'name', example: 'Matematika' },
    ];

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus mata pelajaran ini?')) {
            await deleteSubject(id);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6">
            {/* Excel Utils */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">Import/Export Mata Pelajaran</h3>
                <ExcelUtils
                    onImport={handleImport}
                    onExport={handleExport}
                    templateColumns={templateColumns}
                    filename="Mata_Pelajaran"
                />
                {importing && <p className="text-sm text-purple-600 mt-2">Sedang mengimport data...</p>}
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-4">Tambah Mata Pelajaran</h3>
                <form action={createSubject} className="flex gap-3">
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Nama Mata Pelajaran"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject: any) => (
                    <div
                        key={subject.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition"
                    >
                        {editingId === subject.id ? (
                            <form
                                className="flex items-center gap-2 w-full"
                                action={async (formData) => {
                                    await updateSubject(subject.id, formData);
                                    setEditingId(null);
                                }}
                            >
                                <input
                                    name="name"
                                    defaultValue={subject.name}
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500"
                                    autoFocus
                                />
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
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <BookMarked className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">{subject.name}</h3>
                                        <p className="text-xs text-slate-500">{subject.teachers?.length || 0} Guru</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => setEditingId(subject.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(subject.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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
