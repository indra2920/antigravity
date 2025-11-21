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

    const downloadTemplate = () => {
        // Create header row
        const headers = templateColumns.map(col => col.header);

        // Create example data row
        const exampleRow = templateColumns.map(col => col.example || '');

        // Create worksheet from array of arrays
        const wsData = [headers, exampleRow];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        const colWidths = templateColumns.map(() => ({ wch: 20 }));
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');

        // Write file directly (this is the key fix)
        XLSX.writeFile(wb, `Template_${filename}.xlsx`);
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

    const handleExport = () => {
        const data = onExport();
        const ws = XLSX.utils.json_to_sheet(data);

        // Set column widths
        if (data.length > 0) {
            const colWidths = Object.keys(data[0]).map(() => ({ wch: 20 }));
            ws['!cols'] = colWidths;
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        // Write file directly
        XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
            >
                <Download className="w-4 h-4" />
                Template Excel
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition cursor-pointer text-sm">
                <Upload className="w-4 h-4" />
                Import Excel
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImport}
                    className="hidden"
                />
            </label>

            <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition text-sm"
            >
                <Download className="w-4 h-4" />
                Export Data
            </button>
        </div>
    );
}
