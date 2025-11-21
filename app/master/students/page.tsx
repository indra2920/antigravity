import { getStudents, getClasses } from "../actions";
import MasterDataLayout from "@/components/MasterDataLayout";
import StudentsClient from "./StudentsClient";

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
