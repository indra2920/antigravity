"use server";

import { firestore } from "@/lib/firebase";
import { serializeData } from "@/lib/utils";

export async function getAttendanceReport(dateStr: string) {
    try {
        // Create date range for the query (start of day to end of day)
        const startDate = new Date(dateStr);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateStr);
        endDate.setHours(23, 59, 59, 999);

        const snapshot = await firestore.collection("attendances")
            .where("createdAt", ">=", startDate)
            .where("createdAt", "<=", endDate)
            .orderBy("createdAt", "desc")
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...serializeData(doc.data())
        }));

        // Resolve Relations (Student/Teacher Name)
        const logsWithNames = await Promise.all(logs.map(async (log: any) => {
            let name = "Unknown";
            let role = "Unknown";
            let nis_nip = "-";
            let className = "-";

            if (log.studentId && typeof log.studentId === 'string' && log.studentId.trim() !== '') {
                const sDoc = await firestore.collection("students").doc(log.studentId).get();
                if (sDoc.exists) {
                    const data = sDoc.data();
                    name = data?.name || "Unknown Student";
                    role = "Siswa";
                    nis_nip = data?.nis || "-";

                    // Fetch Class Name
                    // Check if classId is a valid non-empty string
                    if (data?.classId && typeof data.classId === 'string' && data.classId.trim() !== '') {
                        const cDoc = await firestore.collection("classes").doc(data.classId).get();
                        if (cDoc.exists) className = cDoc.data()?.name || "-";
                    }
                }
            } else if (log.teacherId && typeof log.teacherId === 'string' && log.teacherId.trim() !== '') {
                const tDoc = await firestore.collection("teachers").doc(log.teacherId).get(); // Ensure teacherId is treated as string ID

                if (tDoc.exists) {
                    const data = tDoc.data();
                    name = data?.name || "Unknown Teacher";
                    role = "Guru";
                    nis_nip = data?.nip || "-";
                }
            }

            return { ...log, name, role, nis_nip, className };
        }));

        return { success: true, data: logsWithNames };
    } catch (error: any) {
        console.error("Error fetching report:", error);
        return { success: false, error: error.message || "Gagal mengambil data laporan." };
    }
}
