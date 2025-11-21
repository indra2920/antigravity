"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteLevelButton({
    levelId,
    levelName,
    deleteAction,
}: {
    levelId: number;
    levelName: string;
    deleteAction: (formData: FormData) => Promise<void>;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!confirm(`Hapus tingkat ${levelName}?`)) {
            return;
        }

        const formData = new FormData();
        formData.append("id", levelId.toString());

        startTransition(async () => {
            try {
                await deleteAction(formData);
                router.refresh();
            } catch (error) {
                console.error("Error deleting level:", error);
                alert("Gagal menghapus tingkat. Silakan coba lagi.");
            }
        });
    };

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isPending}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            >
                {isPending ? "..." : <Trash2 className="w-4 h-4" />}
            </button>
        </form>
    );
}

