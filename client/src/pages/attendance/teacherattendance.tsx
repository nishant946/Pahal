import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye } from "lucide-react";
import teacherService from "@/services/teacherService";
import type {
  Teacher,
  TeacherAttendanceStats,
} from "@/services/teacherService";

function TeacherAttendance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"weekly" | "monthly">("weekly");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherStats, setTeacherStats] = useState<{
    [id: string]: TeacherAttendanceStats;
  }>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    if (dateRange === "weekly") start.setDate(end.getDate() - 7);
    else if (dateRange === "monthly") start.setMonth(end.getMonth() - 1);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const { startDate, endDate } = getDateRange();

  // Build filtered + sorted list inside a single memo (avoid mutating arrays outside)
  const filteredTeachers = useMemo(() => {
    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [teachers, searchQuery]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const teachersData = await teacherService.getAllTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const statsArr = await Promise.all(
          filteredTeachers.map((teacher) =>
            teacherService.getTeacherAttendanceStats(
              teacher._id,
              startDate,
              endDate
            )
          )
        );
        if (!isMounted) return;

        const statsObj: { [id: string]: TeacherAttendanceStats } = {};
        filteredTeachers.forEach((teacher, i) => {
          statsObj[teacher._id] = statsArr[i] || {
            total: 0,
            present: 0,
            absent: 0,
            attendancePercentage: 0,
          };
        });
        setTeacherStats(statsObj);
      } catch (error) {
        console.error("Error fetching teacher stats:", error);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    if (filteredTeachers.length > 0) {
      fetchStats();
    } else {
      // Reset if nothing to show
      setTeacherStats({});
      setLoadingStats(false);
    }

    return () => {
      isMounted = false;
    };
  }, [filteredTeachers, startDate, endDate]);

  const downloadReport = async () => {
    const headers = [
      "Name",
      "Employee ID",
      "Department",
      "Total Days",
      "Present Days",
      "Absent Days",
      "Attendance %",
    ];
    const statsArray = await Promise.all(
      filteredTeachers.map((teacher) =>
        teacherService.getTeacherAttendanceStats(
          teacher._id,
          startDate,
          endDate
        )
      )
    );
    const csvData = filteredTeachers.map((teacher, i) => {
      const stats = statsArray[i] || {
        total: 0,
        present: 0,
        absent: 0,
        attendancePercentage: 0,
      };
      return [
        teacher.name,
        teacher.rollNo,
        teacher.department,
        stats.total,
        stats.present,
        stats.absent,
        stats.attendancePercentage.toFixed(2),
      ].join(",");
    });
    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teacher_attendance_${dateRange}_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  const viewIndividualReport = (teacherId: string) => {
    navigate(`/attendance/teacher/${teacherId}/report`);
  };

  if (loadingTeachers) {
    return (
      <Layout>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-lg p-4 animate-pulse bg-card"
              >
                <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted/70 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted/70 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/attendance")}>
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">
              Teacher Attendance Report
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dateRange === "weekly" ? "default" : "outline"}
              onClick={() => setDateRange("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={dateRange === "monthly" ? "default" : "outline"}
              onClick={() => setDateRange("monthly")}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Search + Download */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <Input
            type="text"
            placeholder="Search by name, employee ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-sm bg-background border-border"
          />
          <Button onClick={downloadReport} disabled={loadingStats}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Desktop table (xl and up) */}
        <div className="hidden xl:block">
          <div className="bg-card border border-border rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full text-sm text-foreground">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {[
                    "Name",
                    "Employee ID",
                    "Department",
                    "Total Days",
                    "Present",
                    "Absent",
                    "Attendance %",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTeachers.map((teacher) => {
                  const stats = teacherStats[teacher._id] || {
                    total: 0,
                    present: 0,
                    absent: 0,
                    attendancePercentage: 0,
                  };
                  return (
                    <tr
                      key={teacher._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3">{teacher.name}</td>
                      <td className="px-4 sm:px-6 py-3">{teacher.rollNo}</td>
                      <td className="px-4 sm:px-6 py-3">
                        {teacher.department}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-medium">
                        {stats.total}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-medium text-green-600 dark:text-green-400">
                        {stats.present}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-medium text-red-600 dark:text-red-400">
                        {stats.absent}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            stats.attendancePercentage >= 75
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                        >
                          {stats.attendancePercentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewIndividualReport(teacher._id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && !loadingTeachers && (
          <div className="text-center py-8 text-muted-foreground">
            No teachers found.
          </div>
        )}

        {/* Mobile cards (below xl) */}
        <div className="block xl:hidden">
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => {
              const stats = teacherStats[teacher._id] || {
                total: 0,
                present: 0,
                absent: 0,
              };
              return (
                <div
                  key={teacher._id}
                  className="bg-card border border-border rounded-xl shadow-sm p-4"
                >
                  <div className="mb-3">
                    <div className="font-semibold text-base mb-1">
                      {teacher.name}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium text-foreground">
                          Roll:
                        </span>{" "}
                        {teacher.rollNo}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Department:
                        </span>{" "}
                        {teacher.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground">
                      Total: {stats.total} |{" "}
                      <span className="text-green-600 dark:text-green-400">
                        Present: {stats.present}
                      </span>{" "}
                      |{" "}
                      <span className="text-red-600 dark:text-red-400">
                        Absent: {stats.absent}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewIndividualReport(teacher._id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Stats */}
        {loadingStats && (
          <div className="text-center py-4 text-muted-foreground">
            Loading attendance statistics...
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TeacherAttendance;
