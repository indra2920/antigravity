"use client";

import { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { Download, User } from "lucide-react";

export default function IDCard({ student }: { student: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

    useEffect(() => {
        const generateQR = async () => {
            try {
                const qrData = `STUDENT:${student.nis}:${student.name}`;
                const url = await QRCode.toDataURL(qrData, {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#10b981',
                        light: '#FFFFFF'
                    }
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };
        generateQR();
    }, [student.nis, student.name]);

    const handleDownload = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, { scale: 3 });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `KARTU_SISWA_${student.name.replace(/\s/g, '_')}.png`;
            link.click();
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            {/* Modern Card Design */}
            <div ref={cardRef} className="w-[380px] h-[580px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Decorative Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-400/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-8">
                    {/* Header */}
                    <div className="text-center text-white mb-6">
                        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full mb-3">
                            <p className="text-xs font-bold tracking-widest">STUDENT ID CARD</p>
                        </div>
                        <h1 className="text-2xl font-bold mb-1">YAYASAN DARULHUDA</h1>
                        <p className="text-emerald-100 text-sm">Islamic School</p>
                    </div>

                    {/* Photo Section */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-36 h-36 rounded-2xl bg-white p-1.5 shadow-xl">
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
                                    {student.photo ? (
                                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-800 px-4 py-1 rounded-full shadow-lg">
                                <p className="text-xs font-bold">{student.nis}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="bg-white rounded-2xl p-5 shadow-xl flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 text-center mb-1">{student.name}</h2>
                        <p className="text-center text-emerald-600 font-semibold text-sm mb-4">
                            {student.class?.level?.name} - {student.class?.name}
                        </p>

                        <div className="space-y-2 mb-4 text-sm">
                            {student.birthPlace && student.birthDate && (
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">TTL</span>
                                    <span className="font-semibold text-slate-700">{student.birthPlace}, {student.birthDate}</span>
                                </div>
                            )}
                            {student.gender && (
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Jenis Kelamin</span>
                                    <span className="font-semibold text-slate-700">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                </div>
                            )}
                            {student.address && (
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Alamat</span>
                                    <span className="font-semibold text-slate-700 text-right max-w-[200px] truncate">{student.address}</span>
                                </div>
                            )}
                        </div>

                        {/* QR Code */}
                        <div className="mt-auto">
                            <div className="flex justify-center mb-2">
                                {qrCodeUrl ? (
                                    <div className="bg-white p-2 rounded-xl shadow-md">
                                        <img
                                            src={qrCodeUrl}
                                            alt="QR Code"
                                            className="w-28 h-28"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-28 h-28 bg-slate-100 rounded-xl flex items-center justify-center">
                                        <span className="text-xs text-slate-400">Loading...</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-xs text-slate-400 font-medium">Scan untuk Absensi</p>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400">Tahun Ajaran 2024/2025</p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 hover:shadow-xl"
            >
                <Download className="w-5 h-5" />
                Download Kartu Siswa
            </button>
        </div>
    );
}
