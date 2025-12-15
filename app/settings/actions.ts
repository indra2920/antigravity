"use server";

import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

export interface SchoolSettings {
    schoolName: string;
    npsn: string;
    phone: string;
    address: string;
    geofencing: {
        enabled: boolean;
        lat: number;
        lng: number;
        radius: number;
    };
    attendance: {
        entryTime: string;
        lateLimit: string;
        exitTime: string;
        tolerance: number;
    };
    notifications: {
        present: boolean;
        late: boolean;
        absent: boolean;
    };
}

const DEFAULT_SETTINGS: SchoolSettings = {
    schoolName: "YAYASAN DARULHUDA",
    npsn: "12345678",
    phone: "021-12345678",
    address: "Jl. Pendidikan No. 123, Jakarta",
    geofencing: {
        enabled: true,
        lat: -6.200000,
        lng: 106.816666,
        radius: 500
    },
    attendance: {
        entryTime: "07:00",
        lateLimit: "07:30",
        exitTime: "15:00",
        tolerance: 15
    },
    notifications: {
        present: true,
        late: true,
        absent: false
    }
};

export async function getSettings(): Promise<SchoolSettings> {
    try {
        const doc = await firestore.collection("settings").doc("config").get();
        if (!doc.exists) {
            return DEFAULT_SETTINGS;
        }
        return doc.data() as SchoolSettings;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return DEFAULT_SETTINGS;
    }
}

export async function updateSettings(data: SchoolSettings) {
    try {
        await firestore.collection("settings").doc("config").set(data, { merge: true });
        revalidatePath("/settings");
        revalidatePath("/attendance");
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        return { success: false, error: "Gagal menyimpan pengaturan" };
    }
}
