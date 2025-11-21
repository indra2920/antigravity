"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import ExcelUtils from "@/components/ExcelUtils";
import { Trash2, GraduationCap, Mail, MapPin, Calendar, User } from "lucide-react";
import { createTeacher, deleteTeacher } from "../actions";
import { bulkImportTeachers } from "../bulk-actions";

export default function TeachersClient({ teachers, subjects }: { teachers: any[], subjects: any[] }) {
    const [photo, setPhoto] = useState("");
    const [importing, setImporting] = useState(false);

    const handleImport = async (data: any[]) => {
        setImporting(true);
        const result = await bulkImportTeachers(data);
        if (result.success) {
            alert(`Berhasil import ${result.count} guru!`);
            window.location.reload();
        } else {
            alert(`Error: ${result.error}`);
        }
        setImporting(false);
    };

    const handleExport = () => {
        return teachers.map(t => ({
            'Nama Lengkap': t.name,
            'NIP': t.nip,
            'Email': t.email || '',
            'No HP': t.phone || '',
            'Alamat': t.address || '',
            'Tanggal Lahir': t.birthDate || '',
            'Jenis Kelamin': t.gender || '',
            'Mata Pelajaran': t.subject?.name || '',
        }));
    };

    const templateColumns = [
        { header: 'Nama Lengkap', key: 'name', example: 'Dr. Siti Nurhaliza' },
        { header: 'NIP', key: 'nip', example: '197001011998' },
        { header: 'Email', key: 'email', example: 'siti@darulhuda.sch.id' },
        { header: 'No HP', key: 'phone', example: '081234567890' },
        { header: 'Alamat', key: 'address', example: 'Jl. Pendidikan No. 45' },
        { header: 'Tanggal Lahir', key: 'birthDate', example: '1970-01-01' },
        { header: 'Jenis Kelamin', key: 'gender', example: 'P' },
        { header: 'ID Mata Pelajaran', key: 'subjectId', example: '1' },
    ];

    const handleSubmit = async (formData: FormData) => {
        if (photo) {
            formData.set('photo', photo);
        }
        await createTeacher(formData);
        setPhoto("");
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus data guru ini?')) {
            await deleteTeacher(id);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6">
            {/* Excel Utils */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">Import/Export Data Guru</h3>
                <ExcelUtils
                    onImport={handleImport}
                    onExport={handleExport}
                    templateColumns={templateColumns}
                    filename="Data_Guru"
                />
                {importing && <p className="text-sm text-amber-600 mt-2">Sedang mengimport data...</p>}
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    Tambah Guru Baru
                </h3>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="name" type="text" required placeholder="Nama Lengkap *" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <input name="nip" type="text" required placeholder="NIP *" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <input name="email" type="email" placeholder="Email" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <input name="phone" type="tel" placeholder="No. HP" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <select name="gender" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="birthDate" type="date" placeholder="Tanggal Lahir" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <select name="subjectId" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Pilih Mata Pelajaran (Opsional)</option>
                            {subjects.map((subject: any) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                    </div>

                    <textarea name="address" rows={2} placeholder="Alamat Lengkap" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />

                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Foto Guru</h4>
                        <PhotoUpload onPhotoChange={setPhoto} label="Upload Foto" />
                    </div>

                    <button type="submit" className="w-full bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition shadow-lg shadow-amber-200">
                        Simpan Data Guru
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="space-y-3">
                {teachers.map((teacher: any) => (
                    <div key={teacher.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-amber-600 font-bold text-xl flex-shrink-0 overflow-hidden">
                                {teacher.photo ? (
                                    <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                                ) : (
                                    <GraduationCap className="w-8 h-8" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">{teacher.name}</h3>
                                <p className="text-sm text-slate-500 mb-2">
                                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-medium text-xs">{teacher.nip}</span>
                                    {teacher.subject && <span className="ml-2">• {teacher.subject.name}</span>}
                                </p>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                                    {teacher.email && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="truncate">{teacher.email}</span>
                                        </div>
                                    )}
                                    {teacher.phone && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span className="truncate">{teacher.phone}</span>
                                        </div>
                                    )}
                                    {teacher.gender && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <User className="w-3.5 h-3.5" />
                                            <span>{teacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                        </div>
                                    )}
                                    {teacher.birthDate && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{teacher.birthDate}</span>
                                        </div>
                                    )}
                                </div>

                                {teacher.address && (
                                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="truncate">{teacher.address}</span>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => handleDelete(teacher.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
