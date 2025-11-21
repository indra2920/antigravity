import { getSubjects } from "../actions";
import MasterDataLayout from "@/components/MasterDataLayout";
import SubjectsClient from "./SubjectsClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SubjectsPage() {
    const subjects = await getSubjects();

    return (
        <MasterDataLayout
            title="Mata Pelajaran"
            description="Kelola daftar mata pelajaran"
        >
            <SubjectsClient subjects={subjects} />
        </MasterDataLayout>
    );
}
