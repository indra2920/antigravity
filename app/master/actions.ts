"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Optimize Prisma Client for production (prevent multiple instances in serverless)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// ===== LEVELS =====
export async function getLevels() {
    return await prisma.level.findMany({
        include: { classes: true },
        orderBy: { name: "asc" },
    });
}

export async function createLevel(formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.level.create({ data: { name } });
    revalidatePath("/master/levels");
}

export async function updateLevel(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.level.update({ where: { id }, data: { name } });
    revalidatePath("/master/levels");
}

export async function deleteLevel(id: number) {
    try {
        // Check if level has classes
        const level = await prisma.level.findUnique({
            where: { id },
            include: { classes: true }
        });

        if (level && level.classes.length > 0) {
            // Delete all classes first
            await prisma.class.deleteMany({
                where: { levelId: id }
            });
        }

        // Then delete the level
        await prisma.level.delete({ where: { id } });
        revalidatePath("/master/levels");
    } catch (error) {
        console.error("Error deleting level:", error);
        throw error;
    }
}

// ===== CLASSES =====
export async function getClasses() {
    return await prisma.class.findMany({
        include: { level: true, students: true },
        orderBy: { name: "asc" },
    });
}

export async function createClass(formData: FormData) {
    const name = formData.get("name") as string;
    const levelId = parseInt(formData.get("levelId") as string);
    await prisma.class.create({ data: { name, levelId } });
    revalidatePath("/master/classes");
}

export async function updateClass(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const levelId = parseInt(formData.get("levelId") as string);
    await prisma.class.update({ where: { id }, data: { name, levelId } });
    revalidatePath("/master/classes");
}

export async function deleteClass(id: number) {
    await prisma.class.delete({ where: { id } });
    revalidatePath("/master/classes");
}

// ===== SUBJECTS =====
export async function getSubjects() {
    return await prisma.subject.findMany({
        include: { teachers: true },
        orderBy: { name: "asc" },
    });
}

export async function createSubject(formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.subject.create({ data: { name } });
    revalidatePath("/master/subjects");
}

export async function updateSubject(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.subject.update({ where: { id }, data: { name } });
    revalidatePath("/master/subjects");
}

export async function deleteSubject(id: number) {
    await prisma.subject.delete({ where: { id } });
    revalidatePath("/master/subjects");
}

// ===== TEACHERS =====
export async function getTeachers() {
    return await prisma.teacher.findMany({
        include: { subject: true },
        orderBy: { name: "asc" },
    });
}

export async function createTeacher(formData: FormData) {
    const name = formData.get("name") as string;
    const nip = formData.get("nip") as string;
    const email = formData.get("email") as string || null;
    const phone = formData.get("phone") as string || null;
    const address = formData.get("address") as string || null;
    const birthDate = formData.get("birthDate") as string || null;
    const gender = formData.get("gender") as string || null;
    const photo = formData.get("photo") as string || null;
    const subjectId = formData.get("subjectId") ? parseInt(formData.get("subjectId") as string) : null;

    await prisma.teacher.create({
        data: { name, nip, email, phone, address, birthDate, gender, photo, subjectId },
    });
    revalidatePath("/master/teachers");
}

export async function updateTeacher(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const nip = formData.get("nip") as string;
    const phone = formData.get("phone") as string;
    const subjectId = formData.get("subjectId") ? parseInt(formData.get("subjectId") as string) : null;

    await prisma.teacher.update({
        where: { id },
        data: { name, nip, phone, subjectId },
    });
    revalidatePath("/master/teachers");
}

export async function deleteTeacher(id: number) {
    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/master/teachers");
}

// ===== STUDENTS =====
export async function getStudents() {
    return await prisma.student.findMany({
        include: { class: { include: { level: true } } },
        orderBy: { name: "asc" },
    });
}

export async function createStudent(formData: FormData) {
    const name = formData.get("name") as string;
    const nis = formData.get("nis") as string;
    const classId = parseInt(formData.get("classId") as string);
    const email = formData.get("email") as string || null;
    const birthDate = formData.get("birthDate") as string || null;
    const birthPlace = formData.get("birthPlace") as string || null;
    const gender = formData.get("gender") as string || null;
    const address = formData.get("address") as string || null;
    const religion = formData.get("religion") as string || null;
    const parentName = formData.get("parentName") as string || null;
    const parentPhone = formData.get("parentPhone") as string;
    const photo = formData.get("photo") as string || null;

    await prisma.student.create({
        data: {
            name, nis, classId, email, birthDate, birthPlace,
            gender, address, religion, parentName, parentPhone, photo
        },
    });
    revalidatePath("/master/students");
}

export async function updateStudent(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const nis = formData.get("nis") as string;
    const classId = parseInt(formData.get("classId") as string);
    const parentPhone = formData.get("parentPhone") as string;

    await prisma.student.update({
        where: { id },
        data: { name, nis, classId, parentPhone },
    });
    revalidatePath("/master/students");
}

export async function deleteStudent(id: number) {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/master/students");
}

// Helper to seed initial data
export async function seedInitialData() {
    const count = await prisma.level.count();
    if (count === 0) {
        await prisma.level.createMany({
            data: [{ name: "X" }, { name: "XI" }, { name: "XII" }]
        });

        const allLevels = await prisma.level.findMany();

        await prisma.class.createMany({
            data: [
                { name: "IPA 1", levelId: allLevels[0].id },
                { name: "IPS 1", levelId: allLevels[0].id },
                { name: "IPA 1", levelId: allLevels[1].id },
            ]
        });

        await prisma.subject.createMany({
            data: [
                { name: "Matematika" },
                { name: "Bahasa Indonesia" },
                { name: "Bahasa Inggris" },
                { name: "Fisika" },
                { name: "Kimia" },
            ]
        });
    }
}

// ===== SCHEDULES =====
export async function getSchedules() {
    return await prisma.schedule.findMany({
        include: {
            subject: true,
            teacher: true,
            class: { include: { level: true } }
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });
}

export async function createSchedule(formData: FormData) {
    const day = formData.get("day") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const subjectId = parseInt(formData.get("subjectId") as string);
    const teacherId = parseInt(formData.get("teacherId") as string);
    const classId = parseInt(formData.get("classId") as string);

    await prisma.schedule.create({
        data: { day, startTime, endTime, subjectId, teacherId, classId },
    });
    revalidatePath("/schedule");
}

export async function updateSchedule(id: number, formData: FormData) {
    const day = formData.get("day") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const subjectId = parseInt(formData.get("subjectId") as string);
    const teacherId = parseInt(formData.get("teacherId") as string);
    const classId = parseInt(formData.get("classId") as string);

    await prisma.schedule.update({
        where: { id },
        data: { day, startTime, endTime, subjectId, teacherId, classId },
    });
    revalidatePath("/schedule");
}

export async function deleteSchedule(id: number) {
    await prisma.schedule.delete({ where: { id } });
    revalidatePath("/schedule");
}
