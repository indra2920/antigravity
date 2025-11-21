import { getTeachers, getSubjects } from "../actions";
import MasterDataLayout from "@/components/MasterDataLayout";
import TeachersClient from "./TeachersClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeachersPage() {
    const teachers = await getTeachers();
    const subjects = await getSubjects();

    return (
        <MasterDataLayout
            title="Data Guru"
            description="Kelola data guru dan pengajar"
        >
            <TeachersClient teachers={teachers} subjects={subjects} />
        </MasterDataLayout>
    );
}
