import { firestore } from "@/lib/firebase";
import IDCard from "@/components/IDCard";
import { notFound } from "next/navigation";

import { serializeData } from "@/lib/utils";

export default async function IDCardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const docRef = await firestore.collection("students").doc(id).get();

    if (!docRef.exists) return notFound();

    const data = docRef.data();
    // Serialize data to handle Timestamps
    const student = { id: docRef.id, ...serializeData(data) } as any;

    if (student.classId) {
        const classDoc = await firestore.collection("classes").doc(student.classId.toString()).get();
        if (classDoc.exists) {
            student.class = { id: classDoc.id, ...serializeData(classDoc.data()) };
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <IDCard student={student} />
        </div>
    );
}
