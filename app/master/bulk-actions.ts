"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function bulkImportStudents(students: any[]) {
    try {
        for (const student of students) {
            await prisma.student.create({
                data: {
                    name: student['Nama Lengkap'],
                    nis: student['NIS'],
                    email: student['Email'] || null,
                    birthPlace: student['Tempat Lahir'] || null,
                    birthDate: student['Tanggal Lahir'] || null,
                    gender: student['Jenis Kelamin'] || null,
                    address: student['Alamat'] || null,
                    religion: student['Agama'] || null,
                    parentName: student['Nama Orang Tua'] || null,
                    parentPhone: student['No HP Orang Tua'],
                    classId: parseInt(student['ID Kelas']),
                },
            });
        }
        revalidatePath("/master/students");
        return { success: true, count: students.length };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function bulkImportTeachers(teachers: any[]) {
    try {
        for (const teacher of teachers) {
            await prisma.teacher.create({
                data: {
                    name: teacher['Nama Lengkap'],
                    nip: teacher['NIP'],
                    email: teacher['Email'] || null,
                    phone: teacher['No HP'] || null,
                    address: teacher['Alamat'] || null,
                    birthDate: teacher['Tanggal Lahir'] || null,
                    gender: teacher['Jenis Kelamin'] || null,
                    subjectId: teacher['ID Mata Pelajaran'] ? parseInt(teacher['ID Mata Pelajaran']) : null,
                },
            });
        }
        revalidatePath("/master/teachers");
        return { success: true, count: teachers.length };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function bulkImportSubjects(subjects: any[]) {
    try {
        for (const subject of subjects) {
            await prisma.subject.create({
                data: {
                    name: subject['Nama Mata Pelajaran'],
                },
            });
        }
        revalidatePath("/master/subjects");
        return { success: true, count: subjects.length };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
