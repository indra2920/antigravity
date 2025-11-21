"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, RotateCcw } from "lucide-react";

interface PhotoUploadProps {
    onPhotoChange: (base64: string) => void;
    currentPhoto?: string;
    label?: string;
}

export default function PhotoUpload({ onPhotoChange, currentPhoto, label = "Foto" }: PhotoUploadProps) {
    const [preview, setPreview] = useState<string>(currentPhoto || "");
    const [showCamera, setShowCamera] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onPhotoChange(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setShowCamera(true);
                setCapturedPhoto("");
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.");
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const base64 = canvas.toDataURL("image/jpeg", 0.8);
                setCapturedPhoto(base64);
            }
        }
    };

    const confirmPhoto = () => {
        setPreview(capturedPhoto);
        onPhotoChange(capturedPhoto);
        stopCamera();
    };

    const retakePhoto = () => {
        setCapturedPhoto("");
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
        setCapturedPhoto("");
    };

    const removePhoto = () => {
        setPreview("");
        onPhotoChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">{label}</label>

            {/* Preview */}
            {preview && !showCamera && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Buttons */}
            {!preview && !showCamera && (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">Pilih dari Galeri</span>
                    </button>
                    <button
                        type="button"
                        onClick={startCamera}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition"
                    >
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-medium">Ambil Foto</span>
                    </button>
                </div>
            )}

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Ambil Foto
                            </h3>
                            <button
                                onClick={stopCamera}
                                className="text-white hover:bg-white/20 p-2 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Camera/Preview Area */}
                        <div className="p-6">
                            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video">
                                {!capturedPhoto ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={capturedPhoto}
                                        alt="Captured"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Controls */}
                            <div className="mt-6 flex gap-3">
                                {!capturedPhoto ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={stopCamera}
                                            className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={capturePhoto}
                                            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Ambil Foto
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={retakePhoto}
                                            className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition flex items-center justify-center gap-2"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                            Ulangi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmPhoto}
                                            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                                        >
                                            Gunakan Foto Ini
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
