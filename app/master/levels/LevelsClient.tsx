"use client";

import { useState } from "react";
import { Edit2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import DeleteLevelButton from "./DeleteLevelButton";

export default function LevelsClient({
    levels,
    deleteAction
}: {
    levels: any[],
    deleteAction: (formData: FormData) => Promise<void>
}) {
    const [editingId, setEditingId] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            {levels.map((level) => (
                <motion.div
                    key={level.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Tingkat {level.name}</h3>
                                <p className="text-xs text-slate-500">{level.classes?.length || 0} Kelas</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingId(level.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <DeleteLevelButton
                                levelId={level.id}
                                levelName={level.name}
                                deleteAction={deleteAction}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}


