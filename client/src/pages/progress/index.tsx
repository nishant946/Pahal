import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout/layout";
import {
  getStudents,
  getStudentProgress,
  updateStudentProgress,
} from "../../services/progressService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressModal from "./ProgressModal.tsx";
import {
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Edit3,
} from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";
import teacherService from "@/services/teacherService";
import type { Teacher } from "@/services/teacherService";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  mentor?: string;
}

export interface ProgressLog {
  _id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  progress: string;
  timestamp: string;
}

const ProgressPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [modalError, setModalError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [latestProgressMap, setLatestProgressMap] = useState<
    Record<string, ProgressLog | undefined>
  >({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // New state for search, sort, and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "rollNumber" | "mentor" | "lastUpdate"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterBy, setFilterBy] = useState<
    | "all"
    | "with-mentor"
    | "without-mentor"
    | "with-progress"
    | "without-progress"
  >("all");

  // New state for mentor management
  const [activeTeachers, setActiveTeachers] = useState<Teacher[]>([]);
  const [changingMentor, setChangingMentor] = useState<string | null>(null);
  const [selectedMentorForStudent, setSelectedMentorForStudent] = useState<
    Record<string, string>
  >({});

  // Memoized filtered and sorted students
  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      // Search filter
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.mentor &&
          student.mentor.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Category filter
      switch (filterBy) {
        case "with-mentor":
          return student.mentor && student.mentor !== "";
        case "without-mentor":
          return !student.mentor || student.mentor === "";
        case "with-progress":
          return latestProgressMap[student.id]?.progress;
        case "without-progress":
          return !latestProgressMap[student.id]?.progress;
        default:
          return true;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "rollNumber":
          aValue = a.rollNumber.toLowerCase();
          bValue = b.rollNumber.toLowerCase();
          break;
        case "mentor":
          aValue = (a.mentor || "").toLowerCase();
          bValue = (b.mentor || "").toLowerCase();
          break;
        case "lastUpdate":
          aValue = latestProgressMap[a.id]?.timestamp || "";
          bValue = latestProgressMap[b.id]?.timestamp || "";
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [students, searchTerm, sortBy, sortOrder, filterBy, latestProgressMap]);

  useEffect(() => {
    const fetchStudentsAndProgress = async () => {
      try {
        setLoading(true);

        // Fetch students and active teachers in parallel
        const [studentsData, teachersData] = await Promise.all([
          getStudents(),
          teacherService.getAllTeachers(),
        ]);

        console.log("Fetched students data:", studentsData);
        let studentsList = [];
        if (Array.isArray(studentsData)) studentsList = studentsData;
        else if (Array.isArray(studentsData.students))
          studentsList = studentsData.students;

        // Sort students alphabetically by name by default
        studentsList.sort((a: Student, b: Student) =>
          a.name.localeCompare(b.name)
        );

        // Filter active and verified teachers
        const activeTeachersList = teachersData.filter(
          (teacher: Teacher) => teacher.isActive && teacher.isVerified
        );

        setStudents(studentsList);
        setActiveTeachers(activeTeachersList);

        // Fetch latest progress for each student
        const progressMap: Record<string, ProgressLog | undefined> = {};
        await Promise.all(
          studentsList.map(async (student: Student) => {
            try {
              const logs = await getStudentProgress(student.id);
              progressMap[student.id] =
                logs && logs.length > 0 ? logs[0] : undefined;
            } catch {
              progressMap[student.id] = undefined;
            }
          })
        );
        setLatestProgressMap(progressMap);
      } catch (error) {
        console.error("Error fetching students and progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentsAndProgress();
  }, []);

  const handleOpenModal = async (student: Student) => {
    setSelectedStudent(student);
    setModalError("");
    try {
      const logs = await getStudentProgress(student.id);
      setProgressLogs(logs);
      setModalOpen(true);
    } catch {
      setModalError("Could not fetch progress logs. Student may not exist.");
      setProgressLogs([]);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setProgressLogs([]);
  };

  const handleUpdateProgress = async (
    studentId: string,
    progress: string,
    mentor?: string
  ) => {
    setModalError("");
    setUpdating(true);
    console.log("Progress Update: studentId sent to API:", studentId);
    try {
      await updateStudentProgress(studentId, progress, mentor);
      const logs = await getStudentProgress(studentId);
      setProgressLogs(logs);
      // Refresh students list to update mentor field
      const updatedStudents = await getStudents();
      let studentsList = [];
      if (Array.isArray(updatedStudents)) studentsList = updatedStudents;
      else if (Array.isArray(updatedStudents.students))
        studentsList = updatedStudents.students;

      // Sort students alphabetically by name
      studentsList.sort((a: Student, b: Student) =>
        a.name.localeCompare(b.name)
      );

      setStudents(studentsList);
      // Refresh latest progress for all students
      const progressMap: Record<string, ProgressLog | undefined> = {
        ...latestProgressMap,
      };
      await Promise.all(
        studentsList.map(async (student: Student) => {
          try {
            const logs = await getStudentProgress(student.id);
            progressMap[student.id] =
              logs && logs.length > 0 ? logs[0] : undefined;
          } catch {
            progressMap[student.id] = undefined;
          }
        })
      );
      setLatestProgressMap(progressMap);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 404) {
        setModalError(
          "Student not found. Please refresh the student list or check if the student was deleted."
        );
      } else {
        setModalError("Failed to update progress. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleChangeMentor = async (
    studentId: string,
    newMentorName: string
  ) => {
    if (!newMentorName) return;

    try {
      setChangingMentor(studentId);

      // Update the student's mentor using the progress service (which handles mentor assignment)
      await updateStudentProgress(
        studentId,
        "Mentor changed to " + newMentorName,
        newMentorName
      );

      // Refresh students list to update mentor field
      const updatedStudents = await getStudents();
      let studentsList = [];
      if (Array.isArray(updatedStudents)) studentsList = updatedStudents;
      else if (Array.isArray(updatedStudents.students))
        studentsList = updatedStudents.students;

      // Sort students alphabetically by name
      studentsList.sort((a: Student, b: Student) =>
        a.name.localeCompare(b.name)
      );

      setStudents(studentsList);

      // Reset the selected mentor for this student
      setSelectedMentorForStudent((prev) => ({
        ...prev,
        [studentId]: "",
      }));

      // Refresh progress map
      const progressMap: Record<string, ProgressLog | undefined> = {
        ...latestProgressMap,
      };
      try {
        const logs = await getStudentProgress(studentId);
        progressMap[studentId] = logs && logs.length > 0 ? logs[0] : undefined;
      } catch {
        progressMap[studentId] = undefined;
      }
      setLatestProgressMap(progressMap);

      // Show success feedback
      console.log(
        `Mentor changed successfully for ${
          studentsList.find((s: Student) => s.id === studentId)?.name
        }`
      );
    } catch (error) {
      console.error("Error changing mentor:", error);
      alert("Failed to change mentor. Please try again.");
    } finally {
      setChangingMentor(null);
    }
  };

  const handleMentorSelection = (studentId: string, mentorName: string) => {
    setSelectedMentorForStudent((prev) => ({
      ...prev,
      [studentId]: mentorName,
    }));
  };

  console.log("Rendering ProgressPage with students:", students);

  if (loading) {
    return (
      <Layout>
        <div className="p-3 sm:p-4 md:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">
            Progress Management
          </h1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {/* Loading skeleton cards */}
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6">
        {/* Header with Statistics */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Progress Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total: {students.length} | Displayed:{" "}
              {filteredAndSortedStudents.length}
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">With Mentor</p>
                  <p className="text-2xl font-bold">
                    {students.filter((s) => s.mentor && s.mentor !== "").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Without Mentor
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      students.filter((s) => !s.mentor || s.mentor === "")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">With Progress</p>
                  <p className="text-2xl font-bold">
                    {
                      students.filter((s) => latestProgressMap[s.id]?.progress)
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, roll number, or mentor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "name"
                          | "rollNumber"
                          | "mentor"
                          | "lastUpdate"
                      )
                    }
                    className="flex-1 px-3 py-2 border border-border bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Name</option>
                    <option value="rollNumber">Roll Number</option>
                    <option value="mentor">Mentor</option>
                    <option value="lastUpdate">Last Update</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-3"
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter</label>
                <select
                  value={filterBy}
                  onChange={(e) =>
                    setFilterBy(
                      e.target.value as
                        | "all"
                        | "with-mentor"
                        | "without-mentor"
                        | "with-progress"
                        | "without-progress"
                    )
                  }
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Students</option>
                  <option value="with-mentor">With Mentor</option>
                  <option value="without-mentor">Without Mentor</option>
                  <option value="with-progress">With Progress</option>
                  <option value="without-progress">Without Progress</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy("name");
                    setSortOrder("asc");
                    setFilterBy("all");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.isArray(filteredAndSortedStudents) &&
          filteredAndSortedStudents.length > 0 ? (
            filteredAndSortedStudents.map((student) => (
              <div
                key={student.id}
                className="bg-card rounded-lg shadow hover:shadow-lg transition-all duration-200 p-4 flex flex-col gap-2 transform hover:scale-[1.02]"
              >
                <div className="font-semibold text-lg mb-1">
                  {student.name}{" "}
                  <span className="text-muted-foreground text-base font-normal">
                    (Roll No: {student.rollNumber})
                  </span>
                </div>

                {/* Mentor Section with Change Option */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Mentor: {student.mentor || "Not assigned"}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (changingMentor === student.id) {
                        setChangingMentor(null);
                        setSelectedMentorForStudent((prev) => ({
                          ...prev,
                          [student.id]: "",
                        }));
                      } else {
                        setChangingMentor(student.id);
                      }
                    }}
                    className={`h-7 w-7 p-0 transition-all duration-200 ${
                      changingMentor === student.id
                        ? "bg-red-50 border-red-300 hover:bg-red-100 text-red-600"
                        : "hover:bg-blue-50 hover:border-blue-300 text-blue-600"
                    }`}
                    title={
                      changingMentor === student.id
                        ? "Cancel"
                        : student.mentor
                        ? "Change Mentor"
                        : "Assign Mentor"
                    }
                  >
                    {changingMentor === student.id ? (
                      <UserX className="h-3 w-3" />
                    ) : (
                      <Edit3 className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {/* Mentor Selection Dropdown */}
                {changingMentor === student.id && (
                  <div className="bg-muted border border-border rounded-lg p-3 mb-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-foreground">
                        {student.mentor ? "Change Mentor" : "Assign Mentor"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <select
                          value={selectedMentorForStudent[student.id] || ""}
                          onChange={(e) =>
                            handleMentorSelection(student.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                          <option value="" disabled>
                            Choose a mentor...
                          </option>
                          {activeTeachers.map((teacher) => (
                            <option key={teacher._id} value={teacher.name}>
                              {teacher.name} ({teacher.rollNo}) •{" "}
                              {teacher.department}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleChangeMentor(
                              student.id,
                              selectedMentorForStudent[student.id]
                            )
                          }
                          disabled={!selectedMentorForStudent[student.id]}
                          className="px-3 h-9 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 transition-colors duration-200"
                          title="Confirm mentor assignment"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {student.mentor ? "Change" : "Assign"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setChangingMentor(null);
                            setSelectedMentorForStudent((prev) => ({
                              ...prev,
                              [student.id]: "",
                            }));
                          }}
                          className="px-2 h-9 border-border hover:bg-muted transition-colors duration-200"
                          title="Cancel"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {student.mentor && (
                      <div className="mt-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                        Current mentor: {student.mentor}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm text-foreground mb-1">
                  Latest Progress:{" "}
                  {latestProgressMap[student.id]?.progress || "No updates yet"}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Last updated by:{" "}
                  {latestProgressMap[student.id]?.teacherName || "-"}
                  {latestProgressMap[student.id]?.timestamp && (
                    <span className="block">
                      {new Date(
                        latestProgressMap[student.id]!.timestamp
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleOpenModal(student)}
                  className="w-full h-9 transition-all duration-200 hover:bg-blue-50"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : student.mentor && student.mentor !== "" ? (
                    "Update Progress"
                  ) : (
                    "Assign Mentor & Add Progress"
                  )}
                </Button>
              </div>
            ))
          ) : searchTerm || filterBy !== "all" ? (
            <div className="text-center py-8 col-span-3">
              <p className="text-muted-foreground text-sm">
                No students found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("all");
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 col-span-3">
              <p className="text-muted-foreground text-sm">
                No students found.
              </p>
            </div>
          )}
        </div>
        {modalOpen && selectedStudent && (
          <ProgressModal
            student={selectedStudent}
            logs={progressLogs}
            onClose={handleCloseModal}
            onUpdate={handleUpdateProgress}
            error={modalError}
            updating={updating}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProgressPage;
