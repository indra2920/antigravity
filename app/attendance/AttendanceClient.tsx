"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Camera, QrCode, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { submitAttendance } from "./actions";
import { getSettings, SchoolSettings } from "../settings/actions";
import jsQR from "jsqr";

export default function AttendanceClient() {
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [inRadius, setInRadius] = useState<boolean>(false);
    const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"QR" | "FACE">("QR");
    const [status, setStatus] = useState<"IDLE" | "SCANNING" | "SUCCESS" | "ERROR">("IDLE");
    const [message, setMessage] = useState("");
    const [settings, setSettings] = useState<SchoolSettings | null>(null);

    // Camera & Scanning States
    const [cameraError, setCameraError] = useState<string>("");
    const [cameraLoading, setCameraLoading] = useState<boolean>(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentDeviceId, setCurrentDeviceId] = useState<string>("");

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // 1. Initial Load: Settings & Device Listing
    useEffect(() => {
        const init = async () => {
            try {
                const s = await getSettings();
                setSettings(s);
            } catch (error) {
                console.error("Failed to load settings", error);
            }
        };
        init();

        const getDevices = async () => {
            try {
                // Request temporary permission to label devices
                await navigator.mediaDevices.getUserMedia({ video: true });
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = allDevices.filter(d => d.kind === "videoinput");
                setDevices(videoInputs);
                // Do NOT set currentDeviceId immediately (let browser default first)
                // If user selects from dropdown, then we set it.
            } catch (e) {
                console.error("Error listing devices:", e);
            }
        };
        getDevices();

        return () => {
            stopCamera();
        };
    }, []);

    // 2. Camera Management (Start/Stop)
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    const startCamera = async (mode: "QR" | "FACE") => {
        stopCamera(); // Ensure clean slate
        setCameraLoading(true);
        setCameraError("");

        const constraints: MediaStreamConstraints = {
            video: {
                deviceId: currentDeviceId ? { exact: currentDeviceId } : undefined,
                // If no specific device, prioritize user/environment based on mode
                // But if user selected explicit device in dropdown, we use that.
                facingMode: !currentDeviceId ? (mode === "QR" ? "environment" : "user") : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video to actually play before scanning
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(e => console.error("Play error:", e));
                    setCameraLoading(false);
                    if (mode === "QR") {
                        requestAnimationFrame(scanQRCode);
                    }
                };
            }
        } catch (err: any) {
            console.error("Camera Error:", err);
            setCameraLoading(false);
            if (err.name === 'OverconstrainedError') {
                setCameraError("Kamera yang dipilih tidak tersedia. Coba kamera lain (Default).");
                setCurrentDeviceId(""); // Reset to default attempt
            } else if (err.name === 'NotAllowedError') {
                setCameraError("Izin kamera ditolak.");
            } else {
                setCameraError("Gagal mengakses kamera: " + err.message);
            }
        }
    };

    // 3. QR Scanning Logic (Custom)
    const scanQRCode = () => {
        if (!videoRef.current || !canvasRef.current || status !== "IDLE") return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
            // Optimize: Downscale massive 4k/1080p feeds to manageable size for jsQR
            // 480px width is plenty for QR detection and much faster
            const scale = Math.min(1, 480 / video.videoWidth);
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Relaxed options for better detection
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "attemptBoth",
            });

            if (code) {
                handleQRSuccess(code.data);
                return; // Stop scanning loop on success
            } else {
                // Debug: Log occasionally to ensure loop is running
                if (Math.random() < 0.05) console.log("Scanning... No QR found in frame.");
            }
        }

        // Continue loop
        if (activeTab === "QR" && status === "IDLE") {
            animationFrameRef.current = requestAnimationFrame(scanQRCode);
        }
    };

    const handleQRSuccess = async (text: string) => {
        if (status !== "IDLE") return;
        setStatus("SUCCESS");
        setMessage("QR Code Terdeteksi: " + text);
        stopCamera();

        const result = await submitAttendance({
            qrCode: text,
            method: "QR",
            location: `${location?.lat},${location?.lng}`,
            status: "PRESENT"
        });

        if (!result.success) {
            setMessage(result.message || "Gagal absen.");
            return;
        }

        // Redirect to dashboard to show history
        window.location.href = "/";
    };

    // 4. Effect: Handle Tab & Device Changes
    useEffect(() => {
        if (status === "SUCCESS") return; // Don't restart if done

        if (activeTab === "QR") {
            startCamera("QR");
        } else {
            startCamera("FACE");
        }

        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, currentDeviceId, status]); // Restart camera when these change


    // 5. Geolocation (Existing Logic)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        if (!settings) return;
        if (!settings.geofencing.enabled) {
            setInRadius(true);
            setLoadingLocation(false);
            return;
        }
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLocation({ lat, lng });
                const dist = calculateDistance(lat, lng, settings.geofencing.lat, settings.geofencing.lng);
                if (dist <= settings.geofencing.radius) {
                    setInRadius(true);
                } else {
                    setInRadius(false);
                }
                setLoadingLocation(false);
            }, (error) => {
                // ... (Kept existing error handling simplified for brevity in verification, usually stays same)
                console.error(error);
                setLoadingLocation(false);
                setMessage("Gagal mendapatkan lokasi: " + error.message);
            });
        } else {
            setLoadingLocation(false);
            setMessage("Geolocation tidak didukung.");
        }
    }, [settings]);


    // Renders
    if (loadingLocation || !settings) return <div className="p-8 text-center text-slate-500">Menyiapkan sistem...</div>;

    if (!inRadius) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin className="w-8 h-8" /></div>
                <h2 className="text-lg font-bold text-slate-800">Di Luar Jangkauan</h2>
                <div className="text-slate-500 mt-2">Anda berada di luar radius sekolah.</div>
            </div>
        );
    }

    if (status === "SUCCESS") {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8" /></div>
                <h2 className="text-lg font-bold text-slate-800">Absensi Berhasil!</h2>
                <p className="text-slate-500 mt-2">{message}</p>
                <button onClick={() => setStatus("IDLE")} className="mt-6 text-emerald-600 font-medium">Kembali</button>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Location Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 bg-emerald-50 py-2 rounded-lg mb-6">
                <MapPin className="w-3 h-3" />
                <span>{settings.geofencing.enabled ? "Dalam Radius Sekolah" : "Geofencing Non-Aktif (Developer Mode)"}</span>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button onClick={() => setActiveTab("QR")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "QR" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}>
                    <QrCode className="w-4 h-4" /> Scan QR
                </button>
                <button onClick={() => setActiveTab("FACE")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2 ${activeTab === "FACE" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}>
                    <Camera className="w-4 h-4" /> Wajah
                </button>
            </div>

            {/* Camera Area */}
            <div className="max-w-md mx-auto aspect-video bg-black rounded-2xl overflow-hidden relative mb-6">

                {/* 1. Video Element (Always rendered, controlled by stream) */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    autoPlay // Vital for mobile
                />

                {/* 2. Overlays */}
                {cameraLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-6 z-30 text-center">
                        <div>
                            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                            <p className="text-white text-sm">{cameraError}</p>
                            <button onClick={() => startCamera(activeTab)} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded text-sm">Coba Lagi</button>
                        </div>
                    </div>
                )}

                {/* QR Overlay only in QR mode */}
                {activeTab === "QR" && !cameraLoading && !cameraError && (
                    <>
                        <div className="absolute inset-0 pointer-events-none z-10">
                            <div className="w-full h-full border-2 border-emerald-500/50 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] animate-scan"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
                            <p className="text-white text-xs bg-black/50 inline-block px-4 py-2 rounded-full">Arahkan kamera ke QR Code</p>
                        </div>
                    </>
                )}

                {/* Face Overlay */}
                {activeTab === "FACE" && !cameraLoading && !cameraError && (
                    <>
                        <div className="absolute inset-0 pointer-events-none z-10">
                            <div className="w-full h-full border-2 border-emerald-500/50 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] animate-scan"></div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-48 h-64 border-2 border-dashed border-emerald-400/50 rounded-full"></div>
                        </div>
                    </>
                )}

                {/* Device Selector */}
                {devices.length > 0 && (
                    <div className="absolute top-4 right-4 z-40">
                        <select
                            value={currentDeviceId}
                            onChange={(e) => setCurrentDeviceId(e.target.value)}
                            className="bg-black/50 text-white text-[10px] border border-white/20 rounded px-2 py-1 outline-none backdrop-blur-md max-w-[120px]"
                        >
                            <option value="">Default Camera</option>
                            {devices.map((d, i) => (
                                <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Hidden Canvas for QR Processing */}
            <canvas ref={canvasRef} className="hidden" />

            <p className="text-center text-xs text-slate-400">
                {activeTab === "QR" ? "Pastikan QR Code terlihat jelas." : "Pastikan wajah terlihat jelas."}
            </p>
        </div>
    );
}
