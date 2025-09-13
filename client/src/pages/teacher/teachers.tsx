import { useState, useEffect } from "react";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  Search,
  Download,
  RefreshCw,
  User,
  BadgeCheck,
} from "lucide-react";
import teacherService from "@/services/teacherService";
import type { Teacher } from "@/services/teacherService";
import { SkeletonCard } from "@/components/ui/skeleton";

function Teachers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjectChoices.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDepartment =
      selectedDepartment === "all" || teacher.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(
    new Set(teachers.map((teacher) => teacher.department))
  );

  const downloadTeachersList = () => {
    const headers = [
      "Roll No",
      "Name",
      "Mobile No",
      "Email",
      "Department",
      "Designation",
      "Preferred Days",
      "Subject Choices",
      "Qualification",
      "Joining Date",
      "Status",
    ];
    const csvData = filteredTeachers.map((teacher) =>
      [
        teacher.rollNo,
        teacher.name,
        teacher.mobileNo,
        teacher.email,
        teacher.department,
        teacher.designation,
        teacher.preferredDays.join(", "),
        teacher.subjectChoices.join(", "),
        teacher.qualification || "N/A",
        new Date(teacher.joiningDate).toLocaleDateString(),
        teacher.isVerified ? "Verified" : "Unverified",
      ].join(",")
    );

    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `teachers_list_${timestamp}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-3 sm:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Search Skeleton */}
          <div className="mb-6">
            <div className="h-10 w-full max-w-md bg-muted rounded animate-pulse"></div>
          </div>

          {/* Teacher Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} showButton={false} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Teacher Profiles</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={fetchTeachers}
              disabled={loading}
              className="w-full sm:w-auto h-10"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={downloadTeachersList}
              className="w-full sm:w-auto h-10"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download List</span>
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-base"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-border bg-background text-foreground rounded-md px-3 py-2 h-10 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher._id || teacher.id}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-semibold truncate">
                        {teacher.name}
                      </h3>
                      {teacher.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {teacher.designation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Roll No: {teacher.rollNo}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground w-20 flex-shrink-0">
                      Department:
                    </span>
                    <span className="font-medium truncate">
                      {teacher.department}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground w-20 flex-shrink-0">
                      Mobile:
                    </span>
                    <span className="truncate">{teacher.mobileNo}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground w-20 flex-shrink-0">
                      Email:
                    </span>
                    <span className="truncate">{teacher.email}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start text-sm">
                      <span className="text-muted-foreground w-20 flex-shrink-0">
                        Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1 flex-1">
                        {teacher.subjectChoices
                          .slice(0, 3)
                          .map((subject, index) => (
                            <span
                              key={`${
                                teacher._id || teacher.id
                              }-subject-${index}`}
                              className="inline-flex items-center rounded text-xs px-2 py-1 font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:foreground dark:ring-blue-700/50"
                            >
                              {subject}
                            </span>
                          ))}
                        {teacher.subjectChoices.length > 3 && (
                          <span className="inline-flex items-center rounded text-xs px-2 py-1 font-medium bg-muted/60 text-foreground/70 ring-1 ring-border">
                            +{teacher.subjectChoices.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start text-sm">
                      <span className="text-muted-foreground w-20 flex-shrink-0">
                        Preferred:
                      </span>
                      <div className="flex flex-wrap gap-1 flex-1">
                        {teacher.preferredDays.slice(0, 3).map((day, index) => (
                          <span
                            key={`${teacher._id || teacher.id}-day-${index}`}
                            className="inline-flex  items-center rounded text-xs px-2 py-1 font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:foreground dark:ring-emerald-700/50"
                          >
                            {day}
                          </span>
                        ))}
                        {teacher.preferredDays.length > 3 && (
                          <span className="inline-flex items-center rounded text-xs px-2 py-1 font-medium bg-muted/60 text-foreground/70 ring-1 ring-border">
                            +{teacher.preferredDays.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {teacher.qualification && (
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground w-20 flex-shrink-0">
                        Qualification:
                      </span>
                      <span className="truncate">{teacher.qualification}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground w-20 flex-shrink-0">
                      Joined:
                    </span>
                    <span>
                      {new Date(teacher.joiningDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground w-20 flex-shrink-0">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ring-1 ${
                        teacher.isVerified
                          ? "bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/30 dark:foreground dark:ring-green-700/50"
                          : "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:foreground dark:ring-amber-700/50"
                      }`}
                    >
                      {teacher.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 text-sm h-9"
                    onClick={() =>
                      (window.location.href = `mailto:${teacher.email}`)
                    }
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Email</span>
                    <span className="sm:hidden">Mail</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-sm h-9"
                    onClick={() =>
                      (window.location.href = `tel:${teacher.mobileNo}`)
                    }
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              {searchQuery || selectedDepartment !== "all"
                ? "No teachers found matching your criteria."
                : "No teachers found."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Teachers;
