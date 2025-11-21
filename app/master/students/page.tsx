import { getStudents, getClasses } from "../actions";
import MasterDataLayout from "@/components/MasterDataLayout";
import StudentsClient from "./StudentsClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentsPage() {
    const students = await getStudents();
    const classes = await getClasses();

    return (
        <MasterDataLayout
            title="Data Siswa"
            description="Kelola data siswa sekolah"
        >
            <StudentsClient students={students} classes={classes} />
        </MasterDataLayout>
    );
}
