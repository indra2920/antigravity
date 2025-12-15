import { firestore } from "@/lib/firebase";
import { serializeData } from "@/lib/utils";
import TeacherIDCard from "@/components/TeacherIDCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherCardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const teacherDoc = await firestore.collection("teachers").doc(id).get();

    if (!teacherDoc.exists) {
        notFound();
    }

    const teacherData = teacherDoc.data();
    let subject = null;

    if (teacherData?.subjectId) {
        const subjectDoc = await firestore.collection("subjects").doc(teacherData.subjectId).get();
        if (subjectDoc.exists) {
            subject = serializeData({ id: subjectDoc.id, ...subjectDoc.data() });
        }
    }

    const teacher = serializeData({
        id: teacherDoc.id,
        ...teacherData,
        subject: subject
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/teachers" className="p-2 hover:bg-slate-50 rounded-full transition text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800">Kartu Digital Guru</h1>
                        <p className="text-xs text-slate-500">Yayasan Darulhuda</p>
                    </div>
                </div>
            </header>

            <div className="max-w-md mx-auto">
                <TeacherIDCard teacher={teacher} />
            </div>
        </div>
    );
}
