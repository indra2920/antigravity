"use server";

import { firestore } from "@/lib/firebase";
// Helper to serialize Firestore data
import { revalidatePath } from "next/cache";

// Helper to serialize Firestore data
const serializeData = (data: any): any => {
    if (!data) return null;
    if (typeof data !== 'object') return data;

    // Handle Timestamp
    if (data.toDate && typeof data.toDate === 'function') {
        return data.toDate().toISOString(); // Or .toString() or leave as Date object if supported, but ISO string is safest
    }

    // Handle Array
    if (Array.isArray(data)) {
        return data.map(item => serializeData(item));
    }

    // Handle Object
    const newData: any = {};
    for (const key in data) {
        newData[key] = serializeData(data[key]);
    }
    return newData;
};

// Helper to convert Firestore snapshot to serializable object
const mapDoc = (doc: any) => ({
    id: doc.id,
    ...serializeData(doc.data())
});

// ===== LEVELS =====
export async function seedInitialData() {
    const levelsSnap = await firestore.collection("levels").get();
    if (levelsSnap.empty) {
        console.log("Seeding initial data...");
        const levelNames = ["X", "XI", "XII"];
        const levelRefs = [];

        for (const name of levelNames) {
            const ref = await firestore.collection("levels").add({
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            levelRefs.push({ id: ref.id, name });
        }

        // Default Classes
        const l0 = levelRefs.find(l => l.name === "X");
        const l1 = levelRefs.find(l => l.name === "XI");

        if (l0) {
            await firestore.collection("classes").add({ name: "IPA 1", levelId: l0.id, createdAt: new Date() });
            await firestore.collection("classes").add({ name: "IPS 1", levelId: l0.id, createdAt: new Date() });
        }
        if (l1) {
            await firestore.collection("classes").add({ name: "IPA 1", levelId: l1.id, createdAt: new Date() });
        }

        // Default Subjects
        const subjects = ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Biologi"];
        for (const sub of subjects) {
            await firestore.collection("subjects").add({ name: sub, createdAt: new Date() });
        }
    }
}

export async function getLevels() {
    const snapshot = await firestore.collection("levels").orderBy("name").get();
    const levels = snapshot.docs.map(mapDoc);

    // Manually fetch classes for each level (simulating include: { classes: true })
    // This is N+1, but okay for small datasets. For larger, we'd restructure.
    const levelsWithClasses = await Promise.all(levels.map(async (level: any) => {
        const classesSnap = await firestore.collection("classes").where("levelId", "==", parseInt(level.id) || level.id).get();
        const classes = classesSnap.docs.map(mapDoc);
        return { ...level, classes };
    }));

    return levelsWithClasses;
}

export async function createLevel(formData: FormData) {
    const name = formData.get("name") as string;
    // Auto-ID
    await firestore.collection("levels").add({
        name,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/master/levels");
}

export async function updateLevel(id: number | string, formData: FormData) {
    const name = formData.get("name") as string;
    await firestore.collection("levels").doc(id.toString()).update({
        name,
        updatedAt: new Date()
    });
    revalidatePath("/master/levels");
}

export async function deleteLevel(id: number | string) {
    try {
        const _id = id.toString();
        // Check for classes
        const classesSnap = await firestore.collection("classes").where("levelId", "==", parseInt(_id) || _id).get();

        if (!classesSnap.empty) {
            // Cascade delete classes
            const batch = firestore.batch();
            classesSnap.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        await firestore.collection("levels").doc(_id).delete();
        revalidatePath("/master/levels");
    } catch (error) {
        console.error("Error deleting level:", error);
        throw error;
    }
}

// ===== CLASSES =====
export async function getClasses() {
    const snapshot = await firestore.collection("classes").orderBy("name").get();
    const classes = snapshot.docs.map(mapDoc);

    // Fetch relations: Level, Students
    const classesWithRelations = await Promise.all(classes.map(async (cls: any) => {
        // Level
        let level = null;
        if (cls.levelId) {
            const levelDoc = await firestore.collection("levels").doc(cls.levelId.toString()).get();
            if (levelDoc.exists) level = { id: levelDoc.id, ...serializeData(levelDoc.data()) };
        }

        // Students (Count or list? Prisma 'include students' implies list)
        // BEWARE: This could be heavy if many students.
        const studentsSnap = await firestore.collection("students").where("classId", "==", parseInt(cls.id) || cls.id).get();
        const students = studentsSnap.docs.map(mapDoc);

        return { ...cls, level, students };
    }));

    return classesWithRelations;
}

export async function createClass(formData: FormData) {
    const name = formData.get("name") as string;
    // Try to parse levelId as number if possible for compatibility with migrated data
    let levelId: string | number = formData.get("levelId") as string;
    if (!isNaN(parseInt(levelId))) levelId = parseInt(levelId);

    await firestore.collection("classes").add({
        name,
        levelId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/master/classes");
}

export async function updateClass(id: number | string, formData: FormData) {
    const name = formData.get("name") as string;
    let levelId: string | number = formData.get("levelId") as string;
    if (!isNaN(parseInt(levelId))) levelId = parseInt(levelId);

    await firestore.collection("classes").doc(id.toString()).update({
        name,
        levelId,
        updatedAt: new Date()
    });
    revalidatePath("/master/classes");
}

export async function deleteClass(id: number | string) {
    await firestore.collection("classes").doc(id.toString()).delete();
    revalidatePath("/master/classes");
}

// ===== SUBJECTS =====
export async function getSubjects() {
    const snapshot = await firestore.collection("subjects").orderBy("name").get();
    return snapshot.docs.map(mapDoc).map(s => ({
        ...s,
        teachers: [] // TODO: Fetch teachers if needed, postponing to avoid complexity in this chunk
    }));
}

export async function createSubject(formData: FormData) {
    const name = formData.get("name") as string;
    await firestore.collection("subjects").add({
        name,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/master/subjects");
}

export async function updateSubject(id: number | string, formData: FormData) {
    const name = formData.get("name") as string;
    await firestore.collection("subjects").doc(id.toString()).update({
        name,
        updatedAt: new Date()
    });
    revalidatePath("/master/subjects");
}

// ===== TEACHERS =====
export async function getTeachers() {
    const snapshot = await firestore.collection("teachers").orderBy("name").get();
    const teachers = snapshot.docs.map(mapDoc);

    // Fetch relations: Subject
    const teachersWithRelations = await Promise.all(teachers.map(async (teacher: any) => {
        let subject = null;
        if (teacher.subjectId) {
            const subDoc = await firestore.collection("subjects").doc(teacher.subjectId.toString()).get();
            if (subDoc.exists) subject = { id: subDoc.id, ...serializeData(subDoc.data()) };
        }
        return { ...teacher, subject };
    }));

    return teachersWithRelations;
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

    await firestore.collection("teachers").add({
        name, nip, email, phone, address, birthDate, gender, photo, subjectId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/master/teachers");
}

export async function updateTeacher(id: number | string, formData: FormData) {
    const name = formData.get("name") as string;
    const nip = formData.get("nip") as string;
    const email = formData.get("email") as string || null;
    const phone = formData.get("phone") as string || null;
    const address = formData.get("address") as string || null;
    const birthDate = formData.get("birthDate") as string || null;
    const gender = formData.get("gender") as string || null;
    const photo = formData.get("photo") as string || null;

    // Handle subjectId which might be string or number
    let subjectId: string | number | null = formData.get("subjectId") as string;
    if (subjectId && !isNaN(parseInt(subjectId))) {
        subjectId = parseInt(subjectId);
    } else if (!subjectId) {
        subjectId = null;
    }

    await firestore.collection("teachers").doc(id.toString()).update({
        name, nip, email, phone, address, birthDate, gender, photo, subjectId,
        updatedAt: new Date()
    });
    revalidatePath("/master/teachers");
}

export async function deleteTeacher(id: number | string) {
    await firestore.collection("teachers").doc(id.toString()).delete();
    revalidatePath("/master/teachers");
}

// ===== STUDENTS =====
export async function getStudents() {
    const snapshot = await firestore.collection("students").orderBy("name").get();
    const students = snapshot.docs.map(mapDoc);

    // Fetch relations: Class -> Level
    const studentsWithRelations = await Promise.all(students.map(async (student: any) => {
        let classData = null;
        if (student.classId) {
            const classDoc = await firestore.collection("classes").doc(student.classId.toString()).get();
            if (classDoc.exists) {
                const cls = serializeData(classDoc.data());
                let level = null;
                if (cls?.levelId) {
                    const levelDoc = await firestore.collection("levels").doc(cls.levelId.toString()).get();
                    if (levelDoc.exists) level = { id: levelDoc.id, ...serializeData(levelDoc.data()) };
                }
                classData = { id: classDoc.id, ...cls, level };
            }
        }
        return { ...student, class: classData };
    }));

    return studentsWithRelations;
}

export async function createStudent(formData: FormData) {
    const name = formData.get("name") as string;
    const nis = formData.get("nis") as string;

    let classId: string | number = formData.get("classId") as string;
    if (!isNaN(parseInt(classId))) classId = parseInt(classId);

    const email = formData.get("email") as string || null;
    const birthDate = formData.get("birthDate") as string || null;
    const birthPlace = formData.get("birthPlace") as string || null;
    const gender = formData.get("gender") as string || null;
    const address = formData.get("address") as string || null;
    const religion = formData.get("religion") as string || null;
    const parentName = formData.get("parentName") as string || null;
    const parentPhone = formData.get("parentPhone") as string;
    const photo = formData.get("photo") as string || null;

    await firestore.collection("students").add({
        name, nis, classId, email, birthDate, birthPlace,
        gender, address, religion, parentName, parentPhone, photo,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/master/students");
}

export async function updateStudent(id: number | string, formData: FormData) {
    const name = formData.get("name") as string;
    const nis = formData.get("nis") as string;

    let classId: string | number = formData.get("classId") as string;
    if (!isNaN(parseInt(classId))) classId = parseInt(classId);

    const email = formData.get("email") as string || null;
    const birthDate = formData.get("birthDate") as string || null;
    const birthPlace = formData.get("birthPlace") as string || null;
    const gender = formData.get("gender") as string || null;
    const address = formData.get("address") as string || null;
    const religion = formData.get("religion") as string || null;
    const parentName = formData.get("parentName") as string || null;
    const parentPhone = formData.get("parentPhone") as string;
    const photo = formData.get("photo") as string || null;

    await firestore.collection("students").doc(id.toString()).update({
        name, nis, classId, email, birthDate, birthPlace,
        gender, address, religion, parentName, parentPhone, photo,
        updatedAt: new Date()
    });
    revalidatePath("/master/students");
}

export async function deleteStudent(id: number | string) {
    await firestore.collection("students").doc(id.toString()).delete();
    revalidatePath("/master/students");
}

// ===== SCHEDULES =====
export async function getSchedules() {
    const snapshot = await firestore.collection("schedules").orderBy("day").orderBy("startTime").get();
    const schedules = snapshot.docs.map(mapDoc);

    // Fetch relations: Subject, Teacher, Class -> Level
    const schedulesWithRelations = await Promise.all(schedules.map(async (sch: any) => {
        // Subject
        let subject = null;
        if (sch.subjectId) {
            const subDoc = await firestore.collection("subjects").doc(sch.subjectId.toString()).get();
            if (subDoc.exists) subject = { id: subDoc.id, ...serializeData(subDoc.data()) };
        }

        // Teacher
        let teacher = null;
        if (sch.teacherId) {
            const teacherDoc = await firestore.collection("teachers").doc(sch.teacherId.toString()).get();
            if (teacherDoc.exists) teacher = { id: teacherDoc.id, ...serializeData(teacherDoc.data()) };
        }

        // Class
        let classData = null;
        if (sch.classId) {
            const classDoc = await firestore.collection("classes").doc(sch.classId.toString()).get();
            if (classDoc.exists) {
                const cls = serializeData(classDoc.data());
                let level = null;
                if (cls?.levelId) {
                    const levelDoc = await firestore.collection("levels").doc(cls.levelId.toString()).get();
                    if (levelDoc.exists) level = { id: levelDoc.id, ...serializeData(levelDoc.data()) };
                }
                classData = { id: classDoc.id, ...cls, level };
            }
        }

        return { ...sch, subject, teacher, class: classData };
    }));

    return schedulesWithRelations;
}

export async function createSchedule(formData: FormData) {
    const day = formData.get("day") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const subjectId = parseInt(formData.get("subjectId") as string);
    const teacherId = parseInt(formData.get("teacherId") as string);
    const classId = parseInt(formData.get("classId") as string);

    await firestore.collection("schedules").add({
        day, startTime, endTime, subjectId, teacherId, classId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    revalidatePath("/schedule");
}

export async function updateSchedule(id: number | string, formData: FormData) {
    const day = formData.get("day") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const subjectId = parseInt(formData.get("subjectId") as string);
    const teacherId = parseInt(formData.get("teacherId") as string);
    const classId = parseInt(formData.get("classId") as string);

    await firestore.collection("schedules").doc(id.toString()).update({
        day, startTime, endTime, subjectId, teacherId, classId,
        updatedAt: new Date()
    });
    revalidatePath("/schedule");
}

export async function deleteSchedule(id: number | string) {
    await firestore.collection("schedules").doc(id.toString()).delete();
    revalidatePath("/schedule");
}
