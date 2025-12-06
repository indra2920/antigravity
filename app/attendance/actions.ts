"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitAttendance(data: {
    studentId?: number;
    teacherId?: number;
    method: string;
    location: string;
    status: string;
}) {
    await prisma.attendance.create({
        data: {
            studentId: data.studentId,
            teacherId: data.teacherId,
            method: data.method,
            location: data.location,
            status: data.status,
            date: new Date(),
        }
    });

    // Mock WhatsApp Notification
    console.log(`[WHATSAPP MOCK] Sending message to parent of Student ${data.studentId}: "Anak Anda telah hadir di sekolah pada ${new Date().toLocaleTimeString()}"`);

    revalidatePath("/attendance");
    revalidatePath("/");
    return { success: true };
}
