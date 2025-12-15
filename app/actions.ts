"use server";

import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

import { serializeData } from "@/lib/utils";

// Helper
const mapDoc = (doc: any) => ({
    id: doc.id,
    ...serializeData(doc.data())
});

// --- Students ---

// --- Students ---

export async function getStudents() {
    const snapshot = await firestore.collection("students").orderBy("name").get();
    const students = snapshot.docs.map(mapDoc);

    // Fetch relations: Class
    const studentsWithClass = await Promise.all(students.map(async (student: any) => {
        let classData = null;
        if (student.classId) {
            const classDoc = await firestore.collection("classes").doc(student.classId.toString()).get();
            if (classDoc.exists) {
                const cls = serializeData(classDoc.data());
                // Fetch level for class name display logic (e.g. X - IPA 1) if needed
                let level = null;
                if (cls && cls.levelId) {
                    const levelDoc = await firestore.collection("levels").doc(cls.levelId.toString()).get();
                    if (levelDoc.exists) level = { id: levelDoc.id, ...serializeData(levelDoc.data()) };
                }
                classData = cls ? { id: classDoc.id, ...cls, level } : null;
            }
        }
        return { ...student, class: classData };
    }));

    return studentsWithClass;
}

export async function createStudent(formData: FormData) {
    const name = formData.get("name") as string;
    const nis = formData.get("nis") as string;

    let classId: string | number = formData.get("classId") as string;
    if (!isNaN(parseInt(classId))) classId = parseInt(classId);

    const parentPhone = formData.get("parentPhone") as string;

    await firestore.collection("students").add({
        name,
        nis,
        classId,
        parentPhone,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/students");
}

export async function deleteStudent(id: number | string) {
    await firestore.collection("students").doc(id.toString()).delete();
    revalidatePath("/students");
}

// --- Teachers ---

export async function getTeachers() {
    const snapshot = await firestore.collection("teachers").orderBy("name").get();
    const teachers = snapshot.docs.map(mapDoc);

    // Fetch relations: Subject
    const teachersWithSubject = await Promise.all(teachers.map(async (teacher: any) => {
        let subject = null;
        // Logic to fetch subject if needed in this context, 
        // though original getTeachers here included { subject: true }
        if (teacher.subjectId) {
            const subDoc = await firestore.collection("subjects").doc(teacher.subjectId.toString()).get();
            if (subDoc.exists) subject = { id: subDoc.id, ...serializeData(subDoc.data()) };
        }
        return { ...teacher, subject };
    }));
    return teachersWithSubject;
}

export async function createTeacher(formData: FormData) {
    const name = formData.get("name") as string;
    const nip = formData.get("nip") as string;
    const phone = formData.get("phone") as string;

    // Subject is optional for now

    await firestore.collection("teachers").add({
        name,
        nip,
        phone,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/teachers");
}

// --- Classes ---

export async function getClasses() {
    const snapshot = await firestore.collection("classes").get(); // Ordering?
    const classes = snapshot.docs.map(mapDoc);

    const classesWithLevels = await Promise.all(classes.map(async (cls: any) => {
        let level = null;
        if (cls.levelId) {
            const levelDoc = await firestore.collection("levels").doc(cls.levelId.toString()).get();
            if (levelDoc.exists) level = { id: levelDoc.id, ...serializeData(levelDoc.data()) };
        }
        return { ...cls, level };
    }));

    return classesWithLevels;
}

export async function getLevels() {
    const snapshot = await firestore.collection("levels").get();
    return snapshot.docs.map(mapDoc);
}

// --- Seeding Helper (Call once) ---
export async function seedInitialData() {
    // Check if levels exist
    const levelsSnap = await firestore.collection("levels").get();
    const count = levelsSnap.size;

    if (count === 0) {
        // Create Levels
        const levelRefs = [];
        const levelNames = ["X", "XI", "XII"];

        for (const name of levelNames) {
            const ref = await firestore.collection("levels").add({ name, createdAt: new Date() });
            levelRefs.push({ id: ref.id, name });
        }

        // Create Classes
        // X
        const l0 = levelRefs.find(l => l.name === "X");
        const l1 = levelRefs.find(l => l.name === "XI");

        if (l0) {
            await firestore.collection("classes").add({ name: "IPA 1", levelId: l0.id, createdAt: new Date() });
            await firestore.collection("classes").add({ name: "IPS 1", levelId: l0.id, createdAt: new Date() });
        }
        if (l1) {
            await firestore.collection("classes").add({ name: "IPA 1", levelId: l1.id, createdAt: new Date() });
        }
    }
}

