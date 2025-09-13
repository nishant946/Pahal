import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Download } from "lucide-react";
import { useAttendance } from "@/contexts/attendanceContext";

function TodayAttendance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { todayAttendance } = useAttendance();
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const filteredStudents = todayAttendance.presentStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.includes(searchQuery) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ["Roll No", "Name", "Grade", "Group", "Time Marked"];
    const csvData = filteredStudents.map((student) =>
      [
        student.rollNumber,
        student.name,
        student.grade,
        student.group,
        student.timeMarked,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    a.href = url;
    a.download = `attendance_${todayAttendance.date}_${timestamp}.csv`;
    a.click();
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/attendance")}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">Today's Attendance</h1>
          </div>
          <div className="text-gray-600">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            {currentDate}
          </div>
        </div>

        <div className="space-y-6">
          {/* Search and Download Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, roll no, or group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
            <Button onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>

          {/* Stats Card */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h3 className="text-blue-700 font-semibold text-lg mb-2">
              Attendance Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Total Present</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                  {todayAttendance.presentStudents.length}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-blue-900">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Current Date</p>
                <p className="text-lg font-semibold text-blue-900">
                  {todayAttendance.date}
                </p>
              </div>
            </div>
          </div>

          {/* Table/List Section */}
          <div className="bg-card  border-border rounded-xl shadow-sm border ">
            {/* Desktop View */}
            <div className="bg-card hidden sm:grid grid-cols-12 gap-4 p-4 font-semibold border-b  rounded-t-xl">
              <div className="col-span-2">Roll No</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Grade</div>
              <div className="col-span-3">Group</div>
              <div className="col-span-2">Time</div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-4 sm:p-8 text-center text-gray-500">
                No teacher found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Mobile View */}
                    <div className="sm:hidden space-y-2">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          Roll No: {student.rollNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          Grade: {student.grade}
                        </p>
                        <p className="text-sm text-gray-600">
                          Group: {student.group}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Time: {student.timeMarked}
                        </p>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 font-medium text-gray-600">
                        {student.rollNumber}
                      </div>
                      <div className="col-span-3">{student.name}</div>
                      <div className="col-span-2">{student.grade}</div>
                      <div className="col-span-3">{student.group}</div>
                      <div className="col-span-2 text-gray-600">
                        {student.timeMarked}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TodayAttendance;
