import { getRecentAttendances } from "./attendance/actions";
import DashboardClient from "./DashboardClient";

export default async function Home() {
    const recentLogs = await getRecentAttendances();
    return <DashboardClient recentLogs={recentLogs} />;
}
