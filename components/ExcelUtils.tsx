"use client";

import * as XLSX from 'xlsx';
import { Download, Upload } from 'lucide-react';

interface ExcelUtilsProps {
    onImport: (data: any[]) => void;
    onExport: () => any[];
    templateColumns: { header: string; key: string; example?: string }[];
    filename: string;
}

export default function ExcelUtils({ onImport, onExport, templateColumns, filename }: ExcelUtilsProps) {

    // Native Form Submit Download (Bypasses Fetch/Blob/FileSaver)
    const nativeDownload = (payload: any) => {
        try {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "/api/download-native";
            form.target = "_self"; // Download in same tab usually triggers download bar without navigating away

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "payload";
            input.value = JSON.stringify(payload);

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } catch (e) {
            console.error("Native download failed", e);
            alert("Gagal memulai download");
        }
    };

    const downloadTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
        nativeDownload({
            type: 'template',
            columns: templateColumns,
            filename: `Template_${filename}`,
            format: format
        });
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                onImport(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleExport = (format: 'xlsx' | 'csv' = 'xlsx') => {
        const data = onExport();
        const exportFilename = `${filename}_${new Date().toISOString().split('T')[0]}`;

        nativeDownload({
            type: 'data',
            data: data,
            filename: exportFilename,
            format: format
        });
    };

    return (
        <div className="flex gap-2 items-center">
            <div className="flex bg-blue-600 rounded-lg overflow-hidden">
                <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => downloadTemplate('xlsx')}
                    className="flex items-center gap-2 px-4 py-2 text-white font-medium hover:bg-blue-700 transition text-sm border-r border-blue-500"
                >
                    <Download className="w-4 h-4" />
                    Template
                </button>
                <button
                    suppressHydrationWarning
                    type="button"
                    onClick={() => downloadTemplate('csv')}
                    className="px-3 py-2 text-white font-medium hover:bg-blue-700 transition text-xs bg-blue-800"
                    title="Download alternatif CSV"
                >
                    CSV
                </button>
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition cursor-pointer text-sm">
                <Upload className="w-4 h-4" />
                Import Excel
                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImport}
                    className="hidden"
                />
            </label>

            <button
                suppressHydrationWarning
                type="button"
                onClick={() => handleExport('xlsx')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition text-sm"
            >
                <Download className="w-4 h-4" />
                Export Data
            </button>
        </div>
    );
}
