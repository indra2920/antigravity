"use client";

import { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { Download, User, GraduationCap } from "lucide-react";

export default function TeacherIDCard({ teacher }: { teacher: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

    useEffect(() => {
        const generateQR = async () => {
            try {
                // QR Content: NIP for quick scanning
                const qrData = teacher.nip;
                const url = await QRCode.toDataURL(qrData, {
                    width: 300,
                    margin: 0,
                    color: {
                        dark: '#059669', // Emerald 600
                        light: '#FFFFFF'
                    }
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };
        generateQR();
    }, [teacher.nip]);

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                // Increased scale for sharp printing quality
                const canvas = await html2canvas(cardRef.current, {
                    scale: 4,
                    useCORS: true,
                    backgroundColor: null
                });
                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = `KARTU_GURU_${teacher.name.replace(/\s+/g, '_').toUpperCase()}.png`;
                link.click();
            } catch (err) {
                console.error("Download failed", err);
                alert("Gagal mendownload kartu");
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 p-8">
            {/* CARD CONTAINER */}
            <div className="relative group perspective">
                {/* Visual Card */}
                <div
                    ref={cardRef}
                    className="w-[320px] h-[500px] bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex flex-col relative font-sans"
                >
                    {/* TOP SECTION - HEADER */}
                    <div className="h-[180px] bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 relative overflow-hidden">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                        {/* Decorative Circles */}
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute top-20 -left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>

                        {/* Text Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-8 text-white">
                            <div className="flex items-center gap-2 mb-1">
                                <GraduationCap className="w-6 h-6 text-yellow-300" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-amber-100 uppercase">Kartu Tanda Guru</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-wide">YAYASAN DARULHUDA</h1>
                            <p className="text-xs text-amber-100 font-medium tracking-wide">Islamic Boarding School</p>
                        </div>

                        {/* Curve Divider */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] scale-x-150 translate-y-8"></div>
                    </div>

                    {/* MIDDLE SECTION - PHOTO & IDENTITY */}
                    <div className="relative flex flex-col items-center -mt-16 z-20">
                        {/* Profile Photo */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg ring-1 ring-amber-50">
                                <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden relative">
                                    {teacher.photo ? (
                                        <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Role Badge */}
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                <div className="bg-emerald-600 text-white px-3 py-1 rounded-full shadow-md border-2 border-white">
                                    <p className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                        Pengajar
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Name & NIP */}
                        <div className="mt-5 text-center px-4 w-full">
                            <h2 className="text-lg font-bold text-slate-800 uppercase leading-tight mb-1 truncate">
                                {teacher.name}
                            </h2>
                            <p className="text-sm font-mono text-amber-600 font-bold bg-amber-50 inline-block px-3 py-0.5 rounded-md">
                                {teacher.nip}
                            </p>
                        </div>
                    </div>

                    {/* BOTTOM SECTION - DETAILS & QR */}
                    <div className="flex-1 px-6 pt-4 pb-6 flex flex-col justify-between">
                        {/* Divider Line */}
                        <div className="w-12 h-0.5 bg-slate-100 mx-auto my-1"></div>

                        {/* Details Grid */}
                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center group">
                                <span className="text-slate-400 font-medium">Tempat, Tgl Lahir</span>
                                <span className="text-slate-700 font-semibold text-right">
                                    {teacher.birthDate || '-'}
                                </span>
                            </div>
                            <div className="h-px bg-slate-50 w-full"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Mata Pelajaran</span>
                                <span className="text-slate-700 font-semibold">
                                    {teacher.subject?.name || '-'}
                                </span>
                            </div>
                            <div className="h-px bg-slate-50 w-full"></div>
                            <div className="flex justify-between items-start">
                                <span className="text-slate-400 font-medium whitespace-nowrap mr-4">Alamat</span>
                                <span className="text-slate-700 font-semibold text-right leading-tight line-clamp-2">
                                    {teacher.address || '-'}
                                </span>
                            </div>
                        </div>

                        {/* Footer / QR */}
                        <div className="mt-4 flex items-end justify-between">
                            <div className="text-[9px] text-slate-400 leading-relaxed">
                                <p className="font-bold text-slate-500 mb-0.5">Guru Profesional</p>
                                <p>Yayasan Darulhuda School</p>
                                <p>Tahun Ajaran 2024/2025</p>
                            </div>

                            {qrCodeUrl && (
                                <div className="p-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <img src={qrCodeUrl} alt="QR" className="w-24 h-24" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-900 transition shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    Simpan Kartu (PNG)
                </button>
            </div>
        </div>
    );
}
