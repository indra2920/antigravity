"use client";

import { useState } from "react";
import { Settings, School, MapPin, Clock, Bell, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-6 pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Settings className="w-7 h-7 text-emerald-600" />
                    Pengaturan Sistem
                </h1>
                <p className="text-slate-500 text-sm mt-1">Kelola konfigurasi sekolah dan sistem</p>
            </div>

            <div className="space-y-6">
                {/* School Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <School className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Informasi Sekolah</h2>
                            <p className="text-xs text-slate-500">Data identitas sekolah</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-2">Nama Sekolah</label>
                            <input
                                type="text"
                                defaultValue="YAYASAN DARULHUDA"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">NPSN</label>
                                <input
                                    type="text"
                                    defaultValue="12345678"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">No. Telepon</label>
                                <input
                                    type="tel"
                                    defaultValue="021-12345678"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-2">Alamat</label>
                            <textarea
                                rows={3}
                                defaultValue="Jl. Pendidikan No. 123, Jakarta"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Geofencing Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Geofencing</h2>
                            <p className="text-xs text-slate-500">Pengaturan lokasi absensi</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Latitude</label>
                                <input
                                    type="text"
                                    defaultValue="-6.200000"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Longitude</label>
                                <input
                                    type="text"
                                    defaultValue="106.816666"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-2">Radius (meter)</label>
                            <input
                                type="number"
                                defaultValue="500"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                            <p className="text-xs text-slate-400 mt-1">Jarak maksimal dari titik pusat sekolah</p>
                        </div>
                    </div>
                </motion.div>

                {/* Attendance Time Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Waktu Absensi</h2>
                            <p className="text-xs text-slate-500">Jam operasional absensi</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Jam Masuk</label>
                                <input
                                    type="time"
                                    defaultValue="07:00"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Batas Terlambat</label>
                                <input
                                    type="time"
                                    defaultValue="07:30"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Jam Pulang</label>
                                <input
                                    type="time"
                                    defaultValue="15:00"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Toleransi (menit)</label>
                                <input
                                    type="number"
                                    defaultValue="15"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notification Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Notifikasi WhatsApp</h2>
                            <p className="text-xs text-slate-500">Pengaturan pesan otomatis</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Notifikasi Hadir</p>
                                <p className="text-xs text-slate-500">Kirim pesan saat siswa hadir</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Notifikasi Terlambat</p>
                                <p className="text-xs text-slate-500">Kirim pesan saat siswa terlambat</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Notifikasi Tidak Hadir</p>
                                <p className="text-xs text-slate-500">Kirim pesan saat siswa tidak hadir</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.button
                    onClick={handleSave}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Simpan Pengaturan
                </motion.button>

                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium text-center"
                    >
                        ✓ Pengaturan berhasil disimpan!
                    </motion.div>
                )}
            </div>
        </div>
    );
}
