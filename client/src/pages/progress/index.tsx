import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/layout";
import { getStudents, getStudentProgress, updateStudentProgress } from "../../services/progressService";
import { Button } from "@/components/ui/button";
import ProgressModal from "./ProgressModal.tsx";

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
  const [latestProgressMap, setLatestProgressMap] = useState<Record<string, ProgressLog | undefined>>({});

  useEffect(() => {
    const fetchStudentsAndProgress = async () => {
      const data = await getStudents();
      console.log("Fetched students data:", data);
      let studentsList = [];
      if (Array.isArray(data)) studentsList = data;
      else if (Array.isArray(data.students)) studentsList = data.students;
      setStudents(studentsList);
      // Fetch latest progress for each student
      const progressMap: Record<string, ProgressLog | undefined> = {};
      await Promise.all(
        studentsList.map(async (student: Student) => {
          try {
            const logs = await getStudentProgress(student.id);
            progressMap[student.id] = logs && logs.length > 0 ? logs[0] : undefined;
          } catch {
            progressMap[student.id] = undefined;
          }
        })
      );
      setLatestProgressMap(progressMap);
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
    } catch (err: any) {
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

  const handleUpdateProgress = async (studentId: string, progress: string, mentor?: string) => {
    setModalError("");
    console.log("Progress Update: studentId sent to API:", studentId);
    try {
      await updateStudentProgress(studentId, progress, mentor);
      const logs = await getStudentProgress(studentId);
      setProgressLogs(logs);
      // Refresh students list to update mentor field
      const updatedStudents = await getStudents();
      let studentsList = [];
      if (Array.isArray(updatedStudents)) studentsList = updatedStudents;
      else if (Array.isArray(updatedStudents.students)) studentsList = updatedStudents.students;
      setStudents(studentsList);
      // Refresh latest progress for all students
      const progressMap: Record<string, ProgressLog | undefined> = { ...latestProgressMap };
      await Promise.all(
        studentsList.map(async (student: Student) => {
          try {
            const logs = await getStudentProgress(student.id);
            progressMap[student.id] = logs && logs.length > 0 ? logs[0] : undefined;
          } catch {
            progressMap[student.id] = undefined;
          }
        })
      );
      setLatestProgressMap(progressMap);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setModalError("Student not found. Please refresh the student list or check if the student was deleted.");
      } else {
        setModalError("Failed to update progress. Please try again.");
      }
    }
  };

  console.log("Rendering ProgressPage with students:", students);

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Progress Management</h1>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col gap-2">
                <div className="font-semibold text-lg mb-1">
                  {student.name} <span className="text-gray-500 text-base font-normal">(Roll No: {student.rollNumber})</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">Mentor: {student.mentor || "Not assigned"}</div>
                <div className="text-sm text-gray-700 mb-1">
                  Latest Progress: {latestProgressMap[student.id]?.progress || "No updates yet"}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  Last updated by: {latestProgressMap[student.id]?.teacherName || "-"}
                </div>
                <Button variant="outline" onClick={() => handleOpenModal(student)} className="w-full h-9">
                  {student.mentor && student.mentor !== '' ? 'Update Progress' : 'Assign Mentor & Add Progress'}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 col-span-3">
              <p className="text-gray-500 text-sm">No students found.</p>
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
          />
        )}
      </div>
    </Layout>
  );
};

export default ProgressPage;
