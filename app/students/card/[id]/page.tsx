import { prisma } from "@/lib/prisma";
import IDCard from "@/components/IDCard";
import { notFound } from "next/navigation";

export default async function IDCardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await prisma.student.findUnique({
        where: { id: parseInt(id) },
        include: { class: true }
    });

    if (!student) return notFound();

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <IDCard student={student} />
        </div>
    );
}
