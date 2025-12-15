import { getClasses, getLevels } from "../actions";
import MasterDataLayout from "@/components/MasterDataLayout";
import ClassesClient from "./ClassesClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClassesPage() {
    const [classes, levels] = await Promise.all([
        getClasses(),
        getLevels(),
    ]);

    return (
        <MasterDataLayout
            title="Data Kelas"
            description="Kelola kelas berdasarkan tingkatan"
        >
            <ClassesClient classes={classes} levels={levels} />
        </MasterDataLayout>
    );
}
