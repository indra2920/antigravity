import { getSchedules, getSubjects, getTeachers, getClasses } from "../master/actions";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage() {
    const schedules = await getSchedules();
    const subjects = await getSubjects();
    const teachers = await getTeachers();
    const classes = await getClasses();

    return (
        <div className="p-6 pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Jadwal Pelajaran</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola jadwal pelajaran sekolah</p>
            </div>

            <ScheduleClient
                schedules={schedules}
                subjects={subjects}
                teachers={teachers}
                classes={classes}
            />
        </div>
    );
}
