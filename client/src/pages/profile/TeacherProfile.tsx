import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";
import { Camera, User, Save, ArrowLeft, Upload, X } from "lucide-react";
import teacherProfileService from "@/services/teacherProfileService";
import { getAvatarUrl } from "@/services/api";

// Predefined options (same as registration)
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEPARTMENTS = [
  "Information Technology",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics and Communication Engineering",
  "Computer Science Engineering",
  "Mechanical Engineering",
  "Leather Technology",
  "Chemical Engineering",
  "Pharmacy",
  "Biomedical and Robotics Engineering",
  "Other",
];

const SUBJECTS = [
  // Core Academic Subjects
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Sanskrit",
  // Science Subjects (Class 9-10)
  "Physics",
  "Chemistry",
  "Biology",
  // Languages
  "Urdu",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Assamese",
  "Odia",
  "Malayalam",
  "Kannada",
  "French",
  "German",
  "Spanish",
  // Social Sciences
  "History",
  "Geography",
  "Political Science",
  "Economics",
  "Civics",
  // Vocational/Optional Subjects
  "Computer Science",
  "Information Technology",
  "Home Science",
  "Physical Education",
  "Art Education",
  "Music",
  "Dance",
  "Drawing",
  "Painting",
  "Work Education",
  "Health and Physical Education",
  // Additional Subjects
  "Environmental Studies",
  "Moral Science",
  "General Knowledge",
  "Library Science",
  "Other",
];

interface ProfileFormData {
  name: string;
  email: string;
  mobileNo: string;
  department: string;
  designation: string;
  qualification: string;
  preferredDays: string[];
  subjectChoices: string[];
}

const TeacherProfile: React.FC = () => {
  const { teacher, updateTeacherProfile } = useTeacherAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: teacher?.name || "",
    email: teacher?.email || "",
    mobileNo: teacher?.mobileNo || "",
    department: teacher?.department || "",
    designation: teacher?.designation || "",
    qualification: teacher?.qualification || "",
    preferredDays: teacher?.preferredDays || [],
    subjectChoices: teacher?.subjectChoices || [],
  });

  const [avatar, setAvatar] = useState<string | null>(teacher?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [customDepartment, setCustomDepartment] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [availableDepartments, setAvailableDepartments] =
    useState<string[]>(DEPARTMENTS);
  const [availableSubjects, setAvailableSubjects] =
    useState<string[]>(SUBJECTS);

  // Update avatar when teacher data changes
  useEffect(() => {
    if (teacher?.avatar && !avatarFile) {
      // Use the full URL for existing avatars from the server
      const fullAvatarUrl = getAvatarUrl(teacher.avatar);
      setAvatar(fullAvatarUrl);
    }
  }, [teacher?.avatar, avatarFile]);

  // Update form data when teacher data changes
  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        mobileNo: teacher.mobileNo || "",
        department: teacher.department || "",
        designation: teacher.designation || "",
        qualification: teacher.qualification || "",
        preferredDays: teacher.preferredDays || [],
        subjectChoices: teacher.subjectChoices || [],
      });
    }
  }, [teacher]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjectChoices: prev.subjectChoices.includes(subject)
        ? prev.subjectChoices.filter((s) => s !== subject)
        : [...prev.subjectChoices, subject],
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCustomDepartmentAdd = () => {
    if (
      customDepartment.trim() &&
      !availableDepartments.includes(customDepartment.trim())
    ) {
      const newDepartments = [
        ...availableDepartments.slice(0, -1),
        customDepartment.trim(),
        "Other",
      ];
      setAvailableDepartments(newDepartments);
      setFormData((prev) => ({ ...prev, department: customDepartment.trim() }));
      setCustomDepartment("");
    }
  };

  const handleCustomSubjectAdd = () => {
    if (
      customSubject.trim() &&
      !availableSubjects.includes(customSubject.trim())
    ) {
      const newSubjects = [
        ...availableSubjects.slice(0, -1),
        customSubject.trim(),
        "Other",
      ];
      setAvailableSubjects(newSubjects);
      setFormData((prev) => ({
        ...prev,
        subjectChoices: [...prev.subjectChoices, customSubject.trim()],
      }));
      setCustomSubject("");
    }
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobileNo ||
      !formData.department
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return false;
    }
    if (!formData.mobileNo.match(/^[0-9]{10,15}$/)) {
      setMessage({
        type: "error",
        text: "Please enter a valid mobile number (10-15 digits)",
      });
      return false;
    }
    if (formData.preferredDays.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one preferred day",
      });
      return false;
    }
    if (formData.subjectChoices.length === 0) {
      setMessage({ type: "error", text: "Please select at least one subject" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // First upload avatar if present
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await teacherProfileService.uploadAvatar(avatarFile);
        // Update local avatar state with the full URL for display
        const fullAvatarUrl = getAvatarUrl(avatarUrl);
        setAvatar(fullAvatarUrl);
      }

      // Update profile with current avatar URL (either uploaded or existing)
      const updateData = {
        ...formData,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      };

      const response = await teacherProfileService.updateProfile(updateData);

      // Service returns { success, message, data: teacher }
      const updated = response as {
        success?: boolean;
        message?: string;
        data?: { avatar?: string } & typeof formData;
      };
      if (updateTeacherProfile && updated?.data) {
        updateTeacherProfile(updated.data);
        if (updated.data.avatar) {
          setAvatar(getAvatarUrl(updated.data.avatar));
        }
      }

      // Clear the avatar file after successful upload
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update profile. Please try again.";
      setMessage({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Update your personal information and preferences
            </p>
          </div>

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className="mb-6"
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {avatar ? (
                        <img
                          src={getAvatarUrl(avatar) || avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    {avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Upload a photo (max 5MB). JPG, PNG, or GIF format.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNo"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Assistant Professor, Professor, etc."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="B.Tech, M.Tech, PhD, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Department */}
            <Card>
              <CardHeader>
                <CardTitle>Department</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {availableDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  {formData.department === "Other" && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="text"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder="Enter your department"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleCustomDepartmentAdd}
                        disabled={!customDepartment.trim()}
                        className="px-4"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Days */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Preferred Days <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {DAYS_OF_WEEK.map((day) => (
                    <label
                      key={day}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100 select-none">
                        {day}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.preferredDays.length > 0 && (
                  <p className="text-xs text-blue-600 mt-2">
                    Selected: {formData.preferredDays.join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Subject Choices */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Subject Choices <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Core Subjects */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    Core Academic Subjects
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableSubjects.slice(0, 6).map((subject) => (
                      <label
                        key={subject}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.subjectChoices.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-foreground">
                          {subject}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Science Subjects */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    Science Subjects
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableSubjects.slice(6, 9).map((subject) => (
                      <label
                        key={subject}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.subjectChoices.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-foreground">
                          {subject}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Subjects - Collapsible */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    Other Subjects
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border p-3 rounded">
                    {availableSubjects.slice(9, -1).map((subject) => (
                      <label
                        key={subject}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.subjectChoices.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-foreground">
                          {subject}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Subject Addition */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground">
                    Add Custom Subject
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleCustomSubjectAdd}
                      disabled={!customSubject.trim()}
                      className="px-4"
                    >
                      Add Subject
                    </Button>
                  </div>
                </div>

                {formData.subjectChoices.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800 font-medium">
                      Selected Subjects:
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {formData.subjectChoices.join(", ")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="min-w-32">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherProfile;
