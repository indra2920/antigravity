import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { firestore } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
    const results: Record<string, any> = {
        levels: 0,
        classes: 0,
        subjects: 0,
        teachers: 0,
        students: 0,
        schedules: 0,
        attendance: 0,
        errors: [],
    };

    try {
        // 1. Levels
        const levels = await prisma.level.findMany();
        const levelBatch = firestore.batch();
        levels.forEach((level) => {
            const ref = firestore.collection('levels').doc(level.id.toString());
            levelBatch.set(ref, { ...level, id: level.id });
        });
        await levelBatch.commit();
        results.levels = levels.length;

        // 2. Classes
        const classes = await prisma.class.findMany();
        const classBatch = firestore.batch();
        classes.forEach((prop) => {
            const ref = firestore.collection('classes').doc(prop.id.toString());
            classBatch.set(ref, { ...prop, id: prop.id });
        });
        await classBatch.commit();
        results.classes = classes.length;

        // 3. Subjects
        const subjects = await prisma.subject.findMany();
        const subjectBatch = firestore.batch();
        subjects.forEach((subject) => {
            const ref = firestore.collection('subjects').doc(subject.id.toString());
            subjectBatch.set(ref, { ...subject, id: subject.id });
        });
        await subjectBatch.commit();
        results.subjects = subjects.length;

        // 4. Teachers (chunking because batch limit is 500)
        const teachers = await prisma.teacher.findMany();
        let teacherBatch = firestore.batch();
        let teacherCount = 0;
        for (const teacher of teachers) {
            const ref = firestore.collection('teachers').doc(teacher.id.toString());
            teacherBatch.set(ref, { ...teacher, id: teacher.id });
            teacherCount++;
            if (teacherCount % 500 === 0) {
                await teacherBatch.commit();
                teacherBatch = firestore.batch();
            }
        }
        await teacherBatch.commit();
        results.teachers = teachers.length;

        // 5. Students
        const students = await prisma.student.findMany();
        let studentBatch = firestore.batch();
        let studentCount = 0;
        for (const student of students) {
            const ref = firestore.collection('students').doc(student.id.toString());
            studentBatch.set(ref, { ...student, id: student.id });
            studentCount++;
            if (studentCount % 500 === 0) {
                await studentBatch.commit();
                studentBatch = firestore.batch();
            }
        }
        await studentBatch.commit();
        results.students = students.length;

        // 6. Schedules
        const schedules = await prisma.schedule.findMany();
        let scheduleBatch = firestore.batch();
        let scheduleCount = 0;
        for (const schedule of schedules) {
            const ref = firestore.collection('schedules').doc(schedule.id.toString());
            scheduleBatch.set(ref, { ...schedule, id: schedule.id });
            scheduleCount++;
            if (scheduleCount % 500 === 0) {
                await scheduleBatch.commit();
                scheduleBatch = firestore.batch();
            }
        }
        await scheduleBatch.commit();
        results.schedules = schedules.length;

        // 7. Attendance
        const attendance = await prisma.attendance.findMany();
        let attendanceBatch = firestore.batch();
        let attendanceCount = 0;
        for (const record of attendance) {
            const ref = firestore.collection('attendance').doc(record.id.toString());
            attendanceBatch.set(ref, { ...record, id: record.id });
            attendanceCount++;
            if (attendanceCount % 500 === 0) {
                await attendanceBatch.commit();
                attendanceBatch = firestore.batch();
            }
        }
        await attendanceBatch.commit();
        results.attendance = attendance.length;

        return NextResponse.json({ success: true, migrated: results });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { success: false, error: error.message, partialResults: results },
            { status: 500 }
        );
    }
}
