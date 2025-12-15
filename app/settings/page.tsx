"use client";

import { useState, useEffect } from "react";
import { Settings, School, MapPin, Clock, Bell, Save, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getSettings, updateSettings, SchoolSettings } from "./actions";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Initial State structure matching the DB
    const [formData, setFormData] = useState<SchoolSettings>({
        schoolName: "",
        npsn: "",
        phone: "",
        address: "",
        geofencing: {
            enabled: true,
            lat: -6.200000,
            lng: 106.816666,
            radius: 500
        },
        attendance: {
            entryTime: "07:00",
            lateLimit: "07:30",
            exitTime: "15:00",
            tolerance: 15
        },
        notifications: {
            present: true,
            late: true,
            absent: false
        }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSettings();
            setFormData(data);
        } catch (err) {
            setError("Gagal memuat pengaturan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            await updateSettings(formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError("Gagal menyimpan pengaturan");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Generic handler for nested updates
    const updateField = (section: keyof SchoolSettings, field: string, value: any) => {
        setFormData(prev => {
            if (typeof prev[section] === 'object' && prev[section] !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...(prev[section] as any),
                        [field]: value
                    }
                };
            }
            return { ...prev, [section]: value }; // For top level string fields like schoolName
        });
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Memuat pengaturan...</div>;

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
                                value={formData.schoolName}
                                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">NPSN</label>
                                <input
                                    type="text"
                                    value={formData.npsn}
                                    onChange={(e) => setFormData(prev => ({ ...prev, npsn: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">No. Telepon</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-2">Alamat</label>
                            <textarea
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
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
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Geofencing</h2>
                                <p className="text-xs text-slate-500">Pengaturan lokasi absensi</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${formData.geofencing.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {formData.geofencing.enabled ? 'Aktif' : 'Non-Aktif'}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.geofencing.enabled}
                                    onChange={(e) => updateField('geofencing', 'enabled', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className={`space-y-4 transition-opacity ${formData.geofencing.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Latitude</label>
                                <input
                                    type="number"
                                    value={formData.geofencing.lat}
                                    onChange={(e) => updateField('geofencing', 'lat', parseFloat(e.target.value))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Longitude</label>
                                <input
                                    type="number"
                                    value={formData.geofencing.lng}
                                    onChange={(e) => updateField('geofencing', 'lng', parseFloat(e.target.value))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-2">Radius (meter)</label>
                            <input
                                type="number"
                                value={formData.geofencing.radius}
                                onChange={(e) => updateField('geofencing', 'radius', parseInt(e.target.value))}
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
                                    value={formData.attendance.entryTime}
                                    onChange={(e) => updateField('attendance', 'entryTime', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Batas Terlambat</label>
                                <input
                                    type="time"
                                    value={formData.attendance.lateLimit}
                                    onChange={(e) => updateField('attendance', 'lateLimit', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Jam Pulang</label>
                                <input
                                    type="time"
                                    value={formData.attendance.exitTime}
                                    onChange={(e) => updateField('attendance', 'exitTime', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Toleransi (menit)</label>
                                <input
                                    type="number"
                                    value={formData.attendance.tolerance}
                                    onChange={(e) => updateField('attendance', 'tolerance', parseInt(e.target.value))}
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
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.present}
                                    onChange={(e) => updateField('notifications', 'present', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Notifikasi Terlambat</p>
                                <p className="text-xs text-slate-500">Kirim pesan saat siswa terlambat</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.late}
                                    onChange={(e) => updateField('notifications', 'late', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">Notifikasi Tidak Hadir</p>
                                <p className="text-xs text-slate-500">Kirim pesan saat siswa tidak hadir</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.absent}
                                    onChange={(e) => updateField('notifications', 'absent', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-white py-3.5 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2 ${saving ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                >
                    {saving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Simpan Pengaturan
                        </>
                    )}
                </motion.button>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

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
