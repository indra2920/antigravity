import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
    try {
        // Parse Form Data (Native Browser Submit)
        const formData = await req.formData();
        const payloadStr = formData.get('payload') as string;

        if (!payloadStr) {
            return NextResponse.json({ error: 'No payload provided' }, { status: 400 });
        }

        const body = JSON.parse(payloadStr);
        const { columns, data, filename, type, format } = body;

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
                width: 25
            }));

            // Add example row
            const exampleRow: any = {};
            columns.forEach((col: any) => {
                exampleRow[col.key] = col.example || '';
            });
            worksheet.addRow(exampleRow);

            worksheet.getRow(1).font = { bold: true };

        } else {
            worksheet = workbook.addWorksheet('Data');

            if (data && data.length > 0) {
                const keys = Object.keys(data[0]);
                worksheet.columns = keys.map(key => ({
                    header: key,
                    key: key,
                    width: 25
                }));
                worksheet.addRows(data);
                worksheet.getRow(1).font = { bold: true };
            }
        }

        let buf: any;
        let contentType: string;
        let finalFilename: string;

        if (format === 'csv') {
            buf = await workbook.csv.writeBuffer();
            contentType = 'text/csv';
            finalFilename = `${filename}.csv`;
        } else {
            buf = await workbook.xlsx.writeBuffer();
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            finalFilename = `${filename}.xlsx`;
        }

        // Return DIRECT STREAM (Native Download)
        // We use 'new Response' or 'new NextResponse' with the buffer body
        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${finalFilename}"`,
                'Content-Length': buf.byteLength.toString()
            }
        });

    } catch (error) {
        console.error('Native download error:', error);
        return NextResponse.json({ error: 'Failed to generate file' }, { status: 500 });
    }
}
