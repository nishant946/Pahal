import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Download, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAttendance } from "@/contexts/attendanceContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  group: string;
  contact: string;
  parentName: string;
  address: string;
  joinDate: string;
}

function AddStudentDialog({
  onAdd,
}: {
  onAdd: (student: Omit<Student, "id">) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    grade: "",
    group: "A",
    contact: "",
    parentName: "",
    address: "",
    joinDate: new Date().toISOString().split("T")[0],
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setOpen(false); // Close dialog after adding
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border border-border">
          <Plus className="w-4 h-4 mr-2 " />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                className="border border-gray-200"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                className="border border-gray-200"
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rollNumber: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Class</Label>
              <Input
                className="border border-gray-200"
                id="grade"
                value={formData.grade}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, grade: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <select
                id="group"
                className="w-full bg-gray-800 rounded-md border border-gray-200 px-3 py-2"
                value={formData.group}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, group: e.target.value }))
                }
                required
              >
                <option value="A">Group A</option>
                <option value="B">Group B</option>
                <option value="C">Group C</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                className="border border-gray-200"
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contact: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent's Name</Label>
              <Input
                id="parentName"
                className="border border-gray-200"
                value={formData.parentName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="border border-gray-200"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                className="border border-gray-200"
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, joinDate: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Student
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditStudentDialog({
  student,
  onEdit,
}: {
  student: Student;
  onEdit: (id: string, student: Omit<Student, "id">) => Promise<void>;
}) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Handles ISO or other formats
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: student.name,
    rollNumber: student.rollNumber,
    grade: student.grade,
    group: student.group,
    contact: student.contact,
    parentName: student.parentName,
    address: student.address,
    joinDate: formatDate(student.joinDate),
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onEdit(student.id, formData);
    setLoading(false);
    setOpen(false); // Close dialog after update
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rollNumber: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Class</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, grade: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <select
                id="group"
                className="w-full rounded-md border border-input px-3 py-2"
                value={formData.group}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, group: e.target.value }))
                }
                required
              >
                <option value="A">Group A</option>
                <option value="B">Group B</option>
                <option value="C">Group C</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contact: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent's Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, joinDate: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteStudentDialog({
  student,
  onDelete,
}: {
  student: Student;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(student.id);
    setLoading(false);
    setOpen(false); // Close dialog after delete
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {student.name}? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StudentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { students, addStudent, editStudent, deleteStudent } = useAttendance();

  // Wrap edit and delete to return Promise for dialog closing
  const handleEditStudent = async (id: string, data: Omit<Student, "id">) => {
    await editStudent(id, data);
  };
  const handleDeleteStudent = async (id: string) => {
    await deleteStudent(id);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const downloadStudentsList = () => {
    const headers = [
      "Name",
      "Roll Number",
      "Grade",
      "Group",
      "Contact",
      "Parent's Name",
      "Address",
      "Join Date",
    ];
    const csvData = filteredStudents.map((student) =>
      [
        student.name,
        student.rollNumber,
        student.grade,
        student.group,
        student.contact,
        student.parentName,
        student.address,
        student.joinDate,
      ].join(",")
    );

    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `students_list_${timestamp}.csv`;
    a.click();
  };

  return (
    <Layout>
      <div className="p-6">
        {" "}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Students List</h1>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <AddStudentDialog onAdd={addStudent} />
            <Button
              variant="outline"
              onClick={downloadStudentsList}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download List
            </Button>
          </div>
        </div>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, grade, or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 max-w-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFilteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <div className="flex gap-1">
                    <EditStudentDialog
                      student={student}
                      onEdit={handleEditStudent}
                    />
                    <DeleteStudentDialog
                      student={student}
                      onDelete={handleDeleteStudent}
                    />
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-600">Roll Number:</span>{" "}
                    {student.rollNumber}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Grade:</span>{" "}
                    {student.grade}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Group:</span>{" "}
                    {student.group}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Contact:</span>{" "}
                    {student.contact}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Parent:</span>{" "}
                    {student.parentName}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Address:</span>{" "}
                    {student.address}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Join Date:</span>{" "}
                    {new Date(student.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No students found matching your search.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentList;
