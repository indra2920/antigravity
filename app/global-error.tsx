'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h2>
                            <p className="text-slate-600 mb-6">
                                {error.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}
                            </p>
                            <button
                                onClick={reset}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition w-full"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
