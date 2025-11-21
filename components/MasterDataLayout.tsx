"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";

interface MasterDataLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
    onAddClick?: () => void;
}

export default function MasterDataLayout({ title, description, children, onAddClick }: MasterDataLayoutProps) {
    return (
        <div className="p-6 pb-24">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    <p className="text-slate-500 text-sm mt-1">{description}</p>
                </div>
                {onAddClick && (
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Data
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}
