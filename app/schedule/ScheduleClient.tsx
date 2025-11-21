"use client";

import { useState } from "react";
import ExcelUtils from "@/components/ExcelUtils";
import { Trash2, Calendar, Clock, BookOpen, User, School } from "lucide-react";
import { createSchedule, deleteSchedule } from "../master/actions";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function ScheduleClient({ schedules, subjects, teachers, classes }: any) {
    const [importing, setImporting] = useState(false);

    const handleImport = async (data: any[]) => {
        setImporting(true);
        // TODO: Implement bulk import
        alert("Import functionality coming soon!");
        setImporting(false);
    };

    const handleExport = () => {
        return schedules.map((s: any) => ({
            'Hari': s.day,
            'Jam Mulai': s.startTime,
            'Jam Selesai': s.endTime,
            'Mata Pelajaran': s.subject?.name || '',
            'Guru': s.teacher?.name || '',
            'Kelas': `${s.class?.level?.name} ${s.class?.name}`,
        }));
    };

    const templateColumns = [
        { header: 'Hari', key: 'day', example: 'Senin' },
        { header: 'Jam Mulai', key: 'startTime', example: '08:00' },
        { header: 'Jam Selesai', key: 'endTime', example: '09:30' },
        { header: 'ID Mata Pelajaran', key: 'subjectId', example: '1' },
        { header: 'ID Guru', key: 'teacherId', example: '1' },
        { header: 'ID Kelas', key: 'classId', example: '1' },
    ];

    const handleDelete = async (id: number) => {
        if (confirm('Yakin ingin menghapus jadwal ini?')) {
            await deleteSchedule(id);
            window.location.reload();
        }
    };

    // Group schedules by day
    const schedulesByDay = DAYS.map(day => ({
        day,
        schedules: schedules.filter((s: any) => s.day === day)
    }));

    return (
        <div className="space-y-6">
            {/* Excel Utils */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">Import/Export Jadwal</h3>
                <ExcelUtils
                    onImport={handleImport}
                    onExport={handleExport}
                    templateColumns={templateColumns}
                    filename="Jadwal_Pelajaran"
                />
                {importing && <p className="text-sm text-indigo-600 mt-2">Sedang mengimport data...</p>}
            </div>

            {/* Add Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Tambah Jadwal Baru
                </h3>
                <form action={createSchedule} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <select name="day" required className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Pilih Hari *</option>
                            {DAYS.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <input name="startTime" type="time" required placeholder="Jam Mulai" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                        <input name="endTime" type="time" required placeholder="Jam Selesai" className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <select name="subjectId" required className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Pilih Mata Pelajaran *</option>
                            {subjects.map((subject: any) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                        <select name="teacherId" required className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Pilih Guru *</option>
                            {teachers.map((teacher: any) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                        </select>
                        <select name="classId" required className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200">
                            <option value="">Pilih Kelas *</option>
                            {classes.map((cls: any) => (
                                <option key={cls.id} value={cls.id}>{cls.level?.name} - {cls.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Simpan Jadwal
                    </button>
                </form>
            </div>

            {/* Schedule by Day */}
            <div className="space-y-4">
                {schedulesByDay.map(({ day, schedules: daySchedules }) => (
                    <div key={day} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            {day}
                        </h3>

                        {daySchedules.length === 0 ? (
                            <p className="text-slate-400 text-sm italic">Belum ada jadwal</p>
                        ) : (
                            <div className="space-y-2">
                                {daySchedules.map((schedule: any) => (
                                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="flex items-center gap-2 text-indigo-600 font-semibold min-w-[120px]">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{schedule.startTime} - {schedule.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-1">
                                                <BookOpen className="w-4 h-4 text-amber-600" />
                                                <span className="font-semibold text-slate-700">{schedule.subject?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                <User className="w-4 h-4" />
                                                <span>{schedule.teacher?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                <School className="w-4 h-4" />
                                                <span>{schedule.class?.level?.name} {schedule.class?.name}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(schedule.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
