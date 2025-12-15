"use client";

import { useState } from "react";
import { Edit2, BookOpen, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import DeleteLevelButton from "./DeleteLevelButton";
import { updateLevel } from "../actions";

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
                    {editingId === level.id ? (
                        <form
                            className="flex items-center gap-2 w-full"
                            action={async (formData) => {
                                await updateLevel(level.id, formData);
                                setEditingId(null);
                            }}
                        >
                            <input
                                name="name"
                                defaultValue={level.name}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-200"
                                autoFocus
                            />
                            <div className="flex gap-1">
                                <button type="submit" className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex items-center justify-between w-full">
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
                    )}
                </motion.div>
            ))}
        </div>
    );
}
