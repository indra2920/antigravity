"use client";

import { Trash2 } from "lucide-react";

export default function DeleteClassButton({
    classId,
    className,
    deleteAction,
}: {
    classId: number;
    className: string;
    deleteAction: (formData: FormData) => Promise<void>;
}) {
    return (
        <form action={deleteAction}>
            <input type="hidden" name="id" value={classId} />
            <button
                type="submit"
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                onClick={(e) => {
                    if (!confirm(`Hapus kelas ${className}?`)) {
                        e.preventDefault();
                    }
                }}
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </form>
    );
}
