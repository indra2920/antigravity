"use server";

import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

import { serializeData } from "@/lib/utils";

export async function getRecentAttendances() {
    try {
        const snapshot = await firestore.collection("attendances")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...serializeData(doc.data())
        }));

        // Resolve Relations (Student/Teacher Name)
        const logsWithNames = await Promise.all(logs.map(async (log: any) => {
            let name = "Unknown";
            let role = "Unknown";

            // Debug Log
            console.log(`Processing Log ID: ${log.id}, StudentID: ${log.studentId}, TeacherID: ${log.teacherId}`);

            if (log.studentId) {
                const sDoc = await firestore.collection("students").doc(log.studentId).get();
                if (sDoc.exists) {
                    name = sDoc.data()?.name || "Unknown Student";
                    role = "Siswa";
                    console.log(`   -> Found Student: ${name}`);
                } else {
                    console.log(`   -> Student Doc ${log.studentId} does not exist.`);
                }
            } else if (log.teacherId) {
                const tDoc = await firestore.collection("teachers").doc(log.teacherId).get();
                if (tDoc.exists) {
                    name = tDoc.data()?.name || "Unknown Teacher";
                    role = "Guru";
                }
            }

            return { ...log, name, role };
        }));

        return logsWithNames;
    } catch (error) {
        console.error("Error fetching attendance logs:", error);
        return [];
    }
}

export async function submitAttendance(data: {
    qrCode: string; // Changed from studentId/teacherId to normalized qrCode
    method: string;
    location: string;
    status: string;
}) {
    // 1. Identify User from QR Code (NIS or NIP)
    let studentId = null;
    let teacherId = null;

    // Try finding Student by NIS first
    const studentSnapshot = await firestore.collection("students").where("nis", "==", data.qrCode).limit(1).get();
    if (!studentSnapshot.empty) {
        studentId = studentSnapshot.docs[0].id;
    } else {
        // Try finding Teacher by NIP
        const teacherSnapshot = await firestore.collection("teachers").where("nip", "==", data.qrCode).limit(1).get();
        if (!teacherSnapshot.empty) {
            teacherId = teacherSnapshot.docs[0].id;
        } else {
            console.warn("QR Code not found:", data.qrCode);
            return { success: false, message: "Data tidak ditemukan (Bukan Siswa/Guru)." };
        }
    }

    // 2. Save Attendance
    const docRef = await firestore.collection("attendances").add({
        studentId: studentId,
        teacherId: teacherId,
        method: data.method,
        location: data.location,
        status: data.status,
        date: new Date(),
        createdAt: new Date()
    });

    // Mock WhatsApp Notification
    const id = studentId || teacherId;
    console.log(`[WHATSAPP MOCK] Sending message to parent of ID ${id}: "Anak/Guru Anda telah hadir di sekolah pada ${new Date().toLocaleTimeString()}"`);

    revalidatePath("/attendance");
    revalidatePath("/");
    return { success: true, id: docRef.id };
}
