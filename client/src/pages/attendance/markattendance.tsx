import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Calendar } from "lucide-react";
import { useAttendance } from "@/contexts/attendanceContext";

function MarkAttendance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    students,
    todayAttendance,
    markStudentAttendance,
    unmarkStudentAttendance,
  } = useAttendance();
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  if (!students || !todayAttendance || !todayAttendance.presentStudents) {
    return <div>Loading...</div>;
  }

  const filteredStudents = (students ?? []).filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.includes(searchQuery) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFilteredStudents = filteredStudents.sort((a, b) => {
    const groupA = a.rollNumber[0];
    const groupB = b.rollNumber[0];

    const numberA = parseInt(a.rollNumber.slice(1));
    const numberB = parseInt(b.rollNumber.slice(1));

    if (groupA === groupB) {
      return numberA - numberB;
    } else {
      return groupA.localeCompare(groupB);
    }
  });

  const isPresent = (studentId: string) =>
    (todayAttendance?.presentStudents ?? []).some(
      (student) => String(student.id) === String(studentId)
    );

  const toggleAttendance = (studentId: string) => {
    if (isPresent(studentId)) {
      // console.log("Unmarking attendance for student:", studentId);
      unmarkStudentAttendance(studentId);
    } else {
      // console.log("Marking attendance for student:", studentId);
      markStudentAttendance(studentId);
    }
  };

  return (
    <Layout>
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/attendance")}
              className="text-xs sm:text-sm"
            >
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">
              Mark Student Attendance
            </h1>
          </div>
          <div className="text-muted-foreground text-sm sm:text-base">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            {currentDate}
          </div>
        </div>

        <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, roll no, or group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-border focus:border-blue-500 focus:ring-blue-500 text-sm bg-background text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
              <h3 className="text-blue-700 font-semibold text-xs sm:text-sm lg:text-base">
                Total Students
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                {students.length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
              <h3 className="text-green-700 font-semibold text-xs sm:text-sm lg:text-base">
                Present
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                {todayAttendance.presentStudents.length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
              <h3 className="text-red-700 font-semibold text-xs sm:text-sm lg:text-base">
                Absent
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">
                {students.length - todayAttendance.presentStudents.length}
              </p>
            </div>
          </div>

          {/* Table/List Section */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-x-auto">
            {/* Desktop View */}
            <div className="hidden sm:grid grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 font-semibold border-b bg-muted rounded-t-xl text-xs sm:text-sm">
              <div className="col-span-2">Roll No</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Grade</div>
              <div className="col-span-3">Group</div>
              <div className="col-span-2">Attendance</div>
            </div>

            {/* Mobile and Desktop Views */}
            {(sortedFilteredStudents ?? []).length === 0 && (
              <div className="p-4 sm:p-8 text-center text-muted-foreground text-sm sm:text-base">
                No students found.
              </div>
            )}
            {sortedFilteredStudents.length > 0 && (
              <div className="divide-y divide-gray-200">
                {sortedFilteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 sm:p-4 transition-colors ${
                      isPresent(student.id) ? "bg-green-50/50" : ""
                    }`}
                  >
                    {/* Mobile View */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {student.name}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Roll No: {student.rollNumber}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Grade: {student.grade}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Group: {student.group}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Switch
                            checked={isPresent(student.id)}
                            onCheckedChange={() => toggleAttendance(student.id)}
                            id={`attendance-mobile-${student.id}`}
                          />
                          <Label
                            htmlFor={`attendance-mobile-${student.id}`}
                            className={`text-xs sm:text-sm font-medium ${
                              isPresent(student.id)
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {isPresent(student.id) ? "Present" : "Absent"}
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden sm:grid grid-cols-12 gap-3 sm:gap-4 items-center">
                      <div className="col-span-2 font-medium text-muted-foreground text-xs sm:text-sm">
                        {student.rollNumber}
                      </div>
                      <div className="col-span-3 text-xs sm:text-sm">
                        {student.name}
                      </div>
                      <div className="col-span-2 text-xs sm:text-sm">
                        {student.grade}
                      </div>
                      <div className="col-span-3 text-xs sm:text-sm">
                        {student.group}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <Switch
                          checked={isPresent(student.id)}
                          onCheckedChange={() => toggleAttendance(student.id)}
                          id={`attendance-${student.id}`}
                        />
                        <Label
                          htmlFor={`attendance-${student.id}`}
                          className={`text-xs sm:text-sm font-medium ${
                            isPresent(student.id)
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isPresent(student.id) ? "Present" : "Absent"}
                        </Label>
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

export default MarkAttendance;
