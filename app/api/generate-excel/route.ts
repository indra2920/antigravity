import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { columns, data, filename, type, format } = body; // Added format support (xlsx/csv)

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Sistem Akademik';
        workbook.created = new Date();

        let worksheet: ExcelJS.Worksheet;

        if (type === 'template') {
            worksheet = workbook.addWorksheet('Template');

            // Define columns
            worksheet.columns = columns.map((col: any) => ({
                header: col.header,
                key: col.key,
                width: 25 // Set default width
            }));

            // Add example row explicitly as values
            // We need to map keys to the row
            const exampleRow: any = {};
            columns.forEach((col: any) => {
                exampleRow[col.key] = col.example || '';
            });
            worksheet.addRow(exampleRow);

            // Style headers
            worksheet.getRow(1).font = { bold: true };

        } else {
            worksheet = workbook.addWorksheet('Data');

            if (data.length > 0) {
                // Auto-detect columns from data keys if not provided (flexible export)
                const keys = Object.keys(data[0]);
                worksheet.columns = keys.map(key => ({
                    header: key,
                    key: key,
                    width: 25
                }));

                worksheet.addRows(data);

                // Style headers
                worksheet.getRow(1).font = { bold: true };
            }
        }

        let buf: ArrayBuffer;

        if (format === 'csv') {
            // Generate CSV Buffer
            // exceljs writeBuffer for csv returns Buffer, simpler to handle
            buf = await workbook.csv.writeBuffer();
        } else {
            // Generate XLSX Buffer (Default)
            buf = await workbook.xlsx.writeBuffer();
        }

        // Convert buffer to array of numbers for safe JSON transfer
        // ExcelJS returns Node.js Buffer, convert to Uint8Array first
        const fileData = Array.from(new Uint8Array(buf));

        return NextResponse.json({
            file: fileData,
            filename: `${filename}.${format === 'csv' ? 'csv' : 'xlsx'}`
        });

    } catch (error) {
        console.error('Excel generation error:', error);
        return NextResponse.json({ error: 'Failed to generate Excel' }, { status: 500 });
    }
}
