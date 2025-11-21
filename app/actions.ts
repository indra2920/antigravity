"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// --- Students ---

export async function getStudents() {
    return await prisma.student.findMany({
        include: { class: true },
        orderBy: { name: "asc" },
    });
}

export async function createStudent(formData: FormData) {
    const name = formData.get("name") as string;
    const nis = formData.get("nis") as string;
    const classId = parseInt(formData.get("classId") as string);
    const parentPhone = formData.get("parentPhone") as string;

    await prisma.student.create({
        data: {
            name,
            nis,
            classId,
            parentPhone,
        },
    });
    revalidatePath("/students");
}

export async function deleteStudent(id: number) {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/students");
}

// --- Teachers ---

export async function getTeachers() {
    return await prisma.teacher.findMany({
        include: { subject: true },
        orderBy: { name: "asc" },
    });
}

export async function createTeacher(formData: FormData) {
    const name = formData.get("name") as string;
    const nip = formData.get("nip") as string;
    const phone = formData.get("phone") as string;

    // Subject is optional for now

    await prisma.teacher.create({
        data: {
            name,
            nip,
            phone,
        },
    });
    revalidatePath("/teachers");
}

// --- Classes ---

export async function getClasses() {
    return await prisma.class.findMany({
        include: { level: true },
    });
}

export async function getLevels() {
    return await prisma.level.findMany();
}

// --- Seeding Helper (Call once) ---
export async function seedInitialData() {
    // Check if levels exist
    const count = await prisma.level.count();
    if (count === 0) {
        const levels = await prisma.level.createMany({
            data: [
                { name: "X" }, { name: "XI" }, { name: "XII" }
            ]
        });

        // Get IDs (sqlite createMany doesn't return ids easily, so fetch back)
        const allLevels = await prisma.level.findMany();

        await prisma.class.createMany({
            data: [
                { name: "IPA 1", levelId: allLevels[0].id },
                { name: "IPS 1", levelId: allLevels[0].id },
                { name: "IPA 1", levelId: allLevels[1].id },
            ]
        });
    }
}
