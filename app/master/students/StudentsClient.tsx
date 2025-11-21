"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import ExcelUtils from "@/components/ExcelUtils";
import { Trash2, CreditCard, Mail, MapPin, Calendar, User } from "lucide-react";
import Link from "next/link";
import { createStudent, deleteStudent } from "../actions";
import { bulkImportStudents } from "../bulk-actions";

export default function StudentsClient({ students, classes }: { students: any[], classes: any[] }) {
    const [photo, setPhoto] = useState("");
    const [importing, setImporting] = useState(false);

    const handlePhotoChange = (base64: string) => {
        setPhoto(base64);
    };

    const handleImport = async (data: any[]) => {
        setImporting(true);
        const result = await bulkImportStudents(data);
        if (result.success) {
            alert(`Berhasil import ${result.count} siswa!`);
            window.location.reload();
        } else {
            alert(`Error: ${result.error}`);
        }
        setImporting(false);
    };

    const handleExport = () => {
        return students.map(s => ({
            'Nama Lengkap': s.name,
            'NIS': s.nis,
            'Email': s.email || '',
            'Tempat Lahir': s.birthPlace || '',
            'Tanggal Lahir': s.birthDate || '',
            'Jenis Kelamin': s.gender || '',
            'Alamat': s.address || '',
            'Agama': s.religion || '',
            'Kelas': `${s.class?.level?.name} ${s.class?.name}`,
            'Nama Orang Tua': s.parentName || '',
            'No HP Orang Tua': s.parentPhone || '',
        }));
    };

    const templateColumns = [
        { header: 'Nama Lengkap', key: 'name', example: 'Ahmad Rizki' },
        { header: 'NIS', key: 'nis', example: '2024001' },
        { header: 'Email', key: 'email', example: 'ahmad@email.com' },
        { header: 'Tempat Lahir', key: 'birthPlace', example: 'Jakarta' },
        { header: 'Tanggal Lahir', key: 'birthDate', example: '2010-01-15' },
        { header: 'Jenis Kelamin', key: 'gender', example: 'L' },
        { header: 'Alamat', key: 'address', example: 'Jl. Merdeka No. 123' },
        { header: 'Agama', key: 'religion', example: 'Islam' },
        { header: 'Nama Orang Tua', key: 'parentName', example: 'Budi Santoso' },
        { header: 'No HP Orang Tua', key: 'parentPhone', example: '081234567890' },
        { header: 'ID Kelas', key: 'classId', example: '1' },
    ];

    const handleSubmit = async (formData: FormData) => {
        if (photo) {
            formData.set('photo', photo);
        }
        await createStudent(formData);
        setPhoto("");
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus data siswa ini?')) {
            await deleteStudent(id);
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6">
            {/* Excel Utils */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-4 border border-blue-100">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">Import/Export Data Siswa</h3>
                <ExcelUtils
                    onImport={handleImport}
                    onExport={handleExport}
                    templateColumns={templateColumns}
                    filename="Data_Siswa"
                />
                {importing && <p className="text-sm text-blue-600 mt-2">Sedang mengimport data...</p>}
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Tambah Siswa Baru
                </h3>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="name" type="text" required placeholder="Nama Lengkap *" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <input name="nis" type="text" required placeholder="NIS *" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <input name="birthPlace" type="text" placeholder="Tempat Lahir" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <input name="birthDate" type="date" placeholder="Tanggal Lahir" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <select name="gender" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="email" type="email" placeholder="Email" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <select name="religion" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Agama</option>
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Buddha">Buddha</option>
                            <option value="Konghucu">Konghucu</option>
                        </select>
                    </div>

                    <textarea name="address" rows={2} placeholder="Alamat Lengkap" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />

                    <select name="classId" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                        <option value="">Pilih Kelas *</option>
                        {classes.map((cls: any) => (
                            <option key={cls.id} value={cls.id}>{cls.level?.name} - {cls.name}</option>
                        ))}
                    </select>

                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Foto Siswa</h4>
                        <PhotoUpload onPhotoChange={handlePhotoChange} label="Upload Foto" />
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-3">Data Orang Tua / Wali</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="parentName" type="text" placeholder="Nama Orang Tua / Wali" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                            <input name="parentPhone" type="tel" required placeholder="No. HP Orang Tua (WhatsApp) *" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                        Simpan Data Siswa
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="space-y-3">
                {students.map((student: any) => (
                    <div key={student.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0 overflow-hidden">
                                {student.photo ? (
                                    <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                    student.name.substring(0, 2).toUpperCase()
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{student.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-medium text-xs">{student.nis}</span>
                                            <span>•</span>
                                            <span>{student.class?.level?.name} {student.class?.name}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
                                    {student.gender && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <User className="w-3.5 h-3.5" />
                                            <span>{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                        </div>
                                    )}
                                    {student.birthPlace && student.birthDate && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="truncate">{student.birthPlace}, {student.birthDate}</span>
                                        </div>
                                    )}
                                    {student.email && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="truncate">{student.email}</span>
                                        </div>
                                    )}
                                    {student.address && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate">{student.address}</span>
                                        </div>
                                    )}
                                </div>

                                {student.parentName && (
                                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                                        <span className="font-medium">Wali:</span> {student.parentName} • {student.parentPhone}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <Link href={`/students/card/${student.id}`} className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Lihat Kartu">
                                    <CreditCard className="w-5 h-5" />
                                </Link>
                                <button onClick={() => handleDelete(student.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
