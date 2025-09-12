import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ProgressLog, Student } from "./index";

interface ProgressModalProps {
  student: Student;
  logs: ProgressLog[];
  onClose: () => void;
  onUpdate: (studentId: string, progress: string, mentor?: string) => void;
  error?: string;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  student,
  logs,
  onClose,
  onUpdate,
  error,
}) => {
  const [progress, setProgress] = useState("");
  const [mentor, setMentor] = useState(student.mentor || "");
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (progress.trim()) {
      if (!student.mentor || student.mentor === "") {
        onUpdate(student.id, progress, mentor);
      } else {
        onUpdate(student.id, progress);
      }
      setProgress("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  // When dialog closes, call onClose
  const handleDialogOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="p-8 max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Progress for {student.name}
        </h2>
        <div className="mb-6">
          {error && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 p-2 bg-green-100 text-green-700 rounded text-sm text-center">
              Progress updated successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!student.mentor || student.mentor === "" ? (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Mentor Name
                </label>
                <input
                  type="text"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter mentor name"
                  required
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Progress Update
              </label>
              <textarea
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="border rounded-lg px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter new progress update"
                required
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full py-2 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              Submit
            </Button>
          </form>
        </div>
        <div className="mb-3 font-semibold text-gray-700">Progress History</div>
        <div className="max-h-60 overflow-y-auto space-y-3">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center">
              No progress updates yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="text-base text-gray-800 mb-1">
                  {log.progress}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()} by{" "}
                  <span className="font-semibold">{log.teacherName}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 text-right">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-lg px-6 py-2"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;
