import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Eye } from "lucide-react";
import { useAttendance } from "@/contexts/attendanceContext";

function StudentReport() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const { students, getStudentAttendanceStats } = useAttendance();
  const [studentStats, setStudentStats] = useState<{ [id: string]: any }>({});
  // const [loadingStats, setLoadingStats] = useState(false);

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();

    if (dateRange === "weekly") {
      start.setDate(end.getDate() - 7);
    } else if (dateRange === "monthly") {
      start.setMonth(end.getMonth() - 1);
    }

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const { startDate, endDate } = getDateRange();

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.group.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [students, searchQuery]
  );

  // const getAttendanceData = (student: typeof students[0]) => {
  //   return getStudentAttendanceStats(student.id, startDate, endDate);
  // };

  const downloadReport = async () => {
    const headers = [
      "Name",
      "Roll Number",
      "Grade",
      "Group",
      "Total Days",
      "Present Days",
      "Absent Days",
      "Attendance %",
    ];
    // Fetch all stats in parallel
    const statsArray = await Promise.all(
      filteredStudents.map((student) =>
        getStudentAttendanceStats(student.id, startDate, endDate)
      )
    );
    const csvData = filteredStudents.map((student, i) => {
      const stats = statsArray[i] || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        attendancePercentage: 0,
      };
      return [
        student.name,
        student.rollNumber,
        student.grade,
        student.group,
        stats.totalDays,
        stats.presentDays,
        stats.absentDays,
        stats.attendancePercentage.toFixed(2),
      ].join(",");
    });

    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_attendance_${dateRange}_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  const viewIndividualReport = (studentId: string) => {
    navigate(`/attendance/student/${studentId}/report`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      // setLoadingStats(true);
      const statsArr = await Promise.all(
        filteredStudents.map((student) =>
          getStudentAttendanceStats(student.id, startDate, endDate)
        )
      );
      if (isMounted) {
        const statsObj: { [id: string]: any } = {};
        filteredStudents.forEach((student, i) => {
          statsObj[student.id] = statsArr[i] || {
            totalDays: 0,
            presentDays: 0,
            absentDays: 0,
            attendancePercentage: 0,
          };
        });
        setStudentStats(statsObj);
        // setLoadingStats(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [students, searchQuery, startDate, endDate]);

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6">
        {/* Header area: Back button and title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/attendance")}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">
            Student Attendance Report
          </h1>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by name, roll number, grade, or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Button
                variant={dateRange === "weekly" ? "default" : "outline"}
                onClick={() => setDateRange("weekly")}
                className="flex-1 sm:flex-none"
              >
                Weekly
              </Button>
              <Button
                variant={dateRange === "monthly" ? "default" : "outline"}
                onClick={() => setDateRange("monthly")}
                className="flex-1 sm:flex-none"
              >
                Monthly
              </Button>
            </div>
            <Button onClick={downloadReport} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
        </div>

        {/* Card/List view for mobile and tablet */}
        <div className="block xl:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {filteredStudents.map((student) => {
              const stats = studentStats[student.id] || {
                totalDays: 0,
                presentDays: 0,
                absentDays: 0,
                attendancePercentage: 0,
              };
              return (
                <div
                  key={student.id}
                  className="bg-card border border-border rounded-xl shadow-sm  p-4"
                >
                  <div className="mb-3">
                    <div className="font-semibold text-base mb-1">
                      {student.name}
                    </div>
                    <div className="text-sm text-foreground space-y-1">
                      <div>
                        <span className="font-medium">Roll:</span>{" "}
                        {student.rollNumber}
                      </div>
                      <div>
                        <span className="font-medium">Grade:</span>{" "}
                        {student.grade}
                      </div>
                      <div>
                        <span className="font-medium">Group:</span>{" "}
                        {student.group}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="text-foreground">
                      <span className="font-medium">Total:</span>{" "}
                      {stats.totalDays}
                    </div>
                    <div className="text-gforeground">
                      <span className="font-medium">Present:</span>{" "}
                      {stats.presentDays}
                    </div>
                    <div className="textforeground">
                      <span className="font-medium">Absent:</span>{" "}
                      {stats.absentDays}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          stats.attendancePercentage >= 75
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stats.attendancePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewIndividualReport(student.id)}
                    className="w-full flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View Details
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table view for desktop */}
        <div className="hidden xl:block">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Total Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Attendance %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const stats = studentStats[student.id] || {
                      totalDays: 0,
                      presentDays: 0,
                      absentDays: 0,
                      attendancePercentage: 0,
                    };
                    return (
                      <tr
                        key={student.id}
                        className="hover:opacity-80 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {student.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-foreground">
                          {student.group}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {stats.totalDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gforeground font-medium">
                          {stats.presentDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap textforeground font-medium">
                          {stats.absentDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              stats.attendancePercentage >= 75
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stats.attendancePercentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewIndividualReport(student.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground text-lg">
              No students found matching your search.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentReport;
