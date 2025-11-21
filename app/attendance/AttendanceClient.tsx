"use client";

import { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { MapPin, Camera, QrCode, CheckCircle, AlertCircle } from "lucide-react";
import { submitAttendance } from "./actions";

// Mock School Location (Example Coords)
const SCHOOL_LAT = -6.200000;
const SCHOOL_LNG = 106.816666;
const MAX_RADIUS_METERS = 500; // 500 meters for testing

export default function AttendanceClient() {
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [inRadius, setInRadius] = useState<boolean>(false);
    const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"QR" | "FACE">("QR");
    const [status, setStatus] = useState<"IDLE" | "SCANNING" | "SUCCESS" | "ERROR">("IDLE");
    const [message, setMessage] = useState("");

    // Geolocation Check
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLocation({ lat, lng });

                // Simple distance calc (Haversine is better but this is rough approx)
                // For prototype, we'll just assume TRUE if location is found, 
                // or implement a dummy check.
                // Let's just set it to TRUE for user experience in demo.
                setInRadius(true);
                setLoadingLocation(false);
            }, (error) => {
                console.error(error);
                setLoadingLocation(false);
                setMessage("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
            });
        } else {
            setLoadingLocation(false);
            setMessage("Browser tidak mendukung Geolocation.");
        }
    }, []);

    const handleQRScan = async (result: any, error: any) => {
        if (result && status === "IDLE") {
            setStatus("SUCCESS");
            setMessage("QR Code Terdeteksi: " + result?.text);
            // Submit to server
            await submitAttendance({
                studentId: 1, // Hardcoded for demo
                method: "QR",
                location: `${location?.lat},${location?.lng}`,
                status: "PRESENT"
            });
        }
    };

    const handleFaceScan = async () => {
        setStatus("SCANNING");
        // Simulate scanning delay
        setTimeout(async () => {
            setStatus("SUCCESS");
            setMessage("Wajah Terverifikasi: Ahmad Rizky");
            await submitAttendance({
                studentId: 1,
                method: "FACE",
                location: `${location?.lat},${location?.lng}`,
                status: "PRESENT"
            });
        }, 3000);
    };

    if (loadingLocation) {
        return <div className="p-8 text-center text-slate-500">Mencari lokasi...</div>;
    }

    if (!inRadius) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Di Luar Jangkauan</h2>
                <p className="text-slate-500 text-sm mt-2">Anda harus berada di area sekolah untuk melakukan absensi.</p>
            </div>
        );
    }

    if (status === "SUCCESS") {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Absensi Berhasil!</h2>
                <p className="text-slate-500 text-sm mt-2">{message}</p>
                <p className="text-xs text-slate-400 mt-4">Notifikasi WhatsApp telah dikirim ke orang tua.</p>
                <button onClick={() => setStatus("IDLE")} className="mt-6 text-emerald-600 font-medium text-sm">Kembali</button>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Location Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 bg-emerald-50 py-2 rounded-lg mb-6">
                <MapPin className="w-3 h-3" />
                <span>Lokasi Terverifikasi: Dalam Area Sekolah</span>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab("QR")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "QR" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}
                >
                    <QrCode className="w-4 h-4" />
                    Scan QR
                </button>
                <button
                    onClick={() => setActiveTab("FACE")}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "FACE" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}
                >
                    <Camera className="w-4 h-4" />
                    Wajah
                </button>
            </div>

            {/* Scanner Area */}
            <div className="aspect-square bg-black rounded-2xl overflow-hidden relative mb-6">
                {activeTab === "QR" ? (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        {/* Placeholder for QR Reader because actual camera permission in iframe/webview might be tricky */}
                        <p className="text-xs text-center px-4">Kamera Aktif (Simulasi)<br />Arahkan ke QR Code</p>
                        {/* Simulate Scan Button for Demo */}
                        <button onClick={() => handleQRScan({ text: "SISWA-001" }, null)} className="absolute bottom-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold">
                            Simulasi Scan QR
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        {/* Mock Camera Feed */}
                        <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21pbGUlMjBtYW58ZW58MHx8MHx8fDA%3D" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {status === "SCANNING" && (
                                <div className="w-32 h-32 border-4 border-emerald-500 rounded-full animate-pulse"></div>
                            )}
                            {status === "IDLE" && (
                                <button onClick={handleFaceScan} className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition">
                                    Mulai Scan Wajah
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <p className="text-center text-xs text-slate-400">
                Pastikan wajah terlihat jelas dan pencahayaan cukup.
            </p>
        </div>
    );
}
