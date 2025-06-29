import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  FileText,
  Download,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";

interface Syllabus {
  id: string;
  group: "A" | "B" | "C";
  title: string;
  description: string;
  fileUrl: string;
  uploadDate: string;
  subject: string;
}

// Temporary mock data - replace with actual API data later
const mockSyllabus: Syllabus[] = [
  {
    id: "1",
    group: "A",
    title: "Mathematics Syllabus 2025",
    description: "Complete mathematics curriculum for Group A students",
    fileUrl: "/sample.pdf",
    uploadDate: "2025-05-23",
    subject: "Mathematics",
  },
  {
    id: "2",
    group: "B",
    title: "Science Curriculum",
    description: "Detailed science syllabus including practical experiments",
    fileUrl: "/sample.pdf",
    uploadDate: "2025-05-23",
    subject: "Science",
  },
];

function AddSyllabusDialog() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group: "A" as Syllabus["group"],
    subject: "",
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement syllabus upload logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
    } catch (error) {
      console.error("Error uploading syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Syllabus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Syllabus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-md border p-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="w-full rounded-md border p-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Group</label>
            <select
              value={formData.group}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  group: e.target.value as Syllabus["group"],
                }))
              }
              className="w-full rounded-md border p-2"
              required
            >
              <option value="A">Group A</option>
              <option value="B">Group B</option>
              <option value="C">Group C</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-md border p-2 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">File (PDF)</label>
            <div className="border-2 border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <label className="cursor-pointer text-center">
                  <span className="text-blue-500 hover:text-blue-600">
                    Click to upload PDF
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev) => ({ ...prev, file }));
                      }
                    }}
                    required
                  />
                </label>
                {formData.file && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Syllabus"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Syllabus() {
  const { teacher } = useTeacherAuth();
  const [selectedGroup, setSelectedGroup] = useState<Syllabus["group"] | "all">(
    "all"
  );

  const filteredSyllabus =
    selectedGroup === "all"
      ? mockSyllabus
      : mockSyllabus.filter((s) => s.group === selectedGroup);

  // const handleDelete = async (id: string) => {
  //   // TODO: Implement delete functionality
  //   // console.log('Delete syllabus:', id);
  // };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Syllabus</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and access course syllabuses
            </p>
          </div>
          {teacher?.isAdmin && <AddSyllabusDialog />}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedGroup === "all" ? "default" : "outline"}
            onClick={() => setSelectedGroup("all")}
          >
            All Groups
          </Button>
          <Button
            variant={selectedGroup === "A" ? "default" : "outline"}
            onClick={() => setSelectedGroup("A")}
          >
            Group A
          </Button>
          <Button
            variant={selectedGroup === "B" ? "default" : "outline"}
            onClick={() => setSelectedGroup("B")}
          >
            Group B
          </Button>
          <Button
            variant={selectedGroup === "C" ? "default" : "outline"}
            onClick={() => setSelectedGroup("C")}
          >
            Group C
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabus.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold truncate">
                    {item.title}
                  </span>
                  <span className="text-sm font-normal px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Group {item.group}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      {item.subject}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Uploaded on{" "}
                      {new Date(item.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => window.open(item.fileUrl)}
                    >
                      <FileText className="w-4 h-4" />
                      View
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      {teacher?.isAdmin && (
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          // onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSyllabus.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Syllabus Found
            </h3>
            <p className="text-gray-500">
              {teacher?.isAdmin
                ? 'Click the "Add Syllabus" button to upload a new syllabus.'
                : "No syllabus has been uploaded for this group yet."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
