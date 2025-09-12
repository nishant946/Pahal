import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

interface FormState {
  name: string;
  email: string;
  department: string;
  password: string;
  mobile: string;
  rollNumber: string;
  preferredDays: string[];
  subjectChoices: string[];
  batch: string;
}

// Predefined options
const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DEPARTMENTS = [
  'Information Technology',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics and Communication Engineering',
  'Computer Science Engineering',
  'Mechanical Engineering',
  'Leather Technology',
  'Chemical Engineering',
  'Pharmacy',
  'Biomedical and Robotics Engineering',
  'Other'
];

const BATCHES = [
  '2021-2025',
  '2022-2026', 
  '2023-2027',
  '2024-2028',
  '2025-2029',
  'Other'
];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useTeacherAuth();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    department: "",
    password: "",
    mobile: "",
    rollNumber: "",
    preferredDays: [],
    subjectChoices: [],
    batch: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [customDepartment, setCustomDepartment] = useState("");
  const [customBatch, setCustomBatch] = useState("");
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(DEPARTMENTS);
  const [availableBatches, setAvailableBatches] = useState<string[]>(BATCHES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name === 'preferredDays') {
        setForm((prev) => ({
          ...prev,
          preferredDays: checked
            ? [...prev.preferredDays, value]
            : prev.preferredDays.filter(day => day !== value)
        }));
      }
    } else if (name === 'subjectChoices') {
      // Convert comma-separated string to array
      const subjectsArray = value.split(',').map(subject => subject.trim()).filter(subject => subject.length > 0);
      setForm((prev) => ({ ...prev, [name]: subjectsArray }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    setValidationError(null);
  };

  const handleDayToggle = (day: string) => {
    setForm((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
    setValidationError(null);
  };

  const handleDepartmentChange = (value: string) => {
    setForm((prev) => ({ ...prev, department: value }));
    setValidationError(null);
  };

  const handleCustomDepartmentAdd = () => {
    if (customDepartment.trim() && !availableDepartments.includes(customDepartment.trim())) {
      const newDepartments = [...availableDepartments.slice(0, -1), customDepartment.trim(), 'Other'];
      setAvailableDepartments(newDepartments);
      setForm((prev) => ({ ...prev, department: customDepartment.trim() }));
      setCustomDepartment("");
    }
  };

  const handleBatchChange = (value: string) => {
    setForm((prev) => ({ ...prev, batch: value }));
    setValidationError(null);
  };

  const handleCustomBatchAdd = () => {
    if (customBatch.trim() && !availableBatches.includes(customBatch.trim())) {
      const newBatches = [...availableBatches.slice(0, -1), customBatch.trim(), 'Other'];
      setAvailableBatches(newBatches);
      setForm((prev) => ({ ...prev, batch: customBatch.trim() }));
      setCustomBatch("");
    }
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.mobile || !form.rollNumber || !form.department || !form.batch) {
      setValidationError("All fields are required");
      return false;
    }
    if (form.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    if (!form.mobile.match(/^[0-9]{10,15}$/)) {
      setValidationError("Please enter a valid mobile number (10-15 digits)");
      return false;
    }
    if (form.preferredDays.length === 0) {
      setValidationError("Please select at least one preferred day");
      return false;
    }
    if (form.subjectChoices.length === 0) {
      setValidationError("Please enter at least one subject choice");
      return false;
    }
    if (form.department === 'Other') {
      setValidationError("Please add your custom department before submitting");
      return false;
    }
    if (form.batch === 'Other') {
      setValidationError("Please add your custom batch before submitting");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(form);
      // Registration successful, redirect to login with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please wait for admin verification before logging in.' 
        } 
      });
    } catch (err) {
      // Error is handled by the context
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div>
          <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your teacher account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and help shape young minds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name<span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile <span className="text-red-500">*</span></Label>
              <Input
                id="mobile"
                name="mobile"
                type="text"
                required
                value={form.mobile}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              
              {form.department === 'Other' && (
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
            
            <div className="space-y-2">
              <Label htmlFor="batch">Batch <span className="text-red-500">*</span></Label>
              <select
                id="batch"
                name="batch"
                value={form.batch}
                onChange={(e) => handleBatchChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Batch</option>
                {availableBatches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
              
              {form.batch === 'Other' && (
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    value={customBatch}
                    onChange={(e) => setCustomBatch(e.target.value)}
                    placeholder="Enter your batch (e.g., 2024-2028)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleCustomBatchAdd}
                    disabled={!customBatch.trim()}
                    className="px-4"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number <span className="text-red-500">*</span></Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                type="text"
                value={form.rollNumber}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your roll number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password  <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full"
                placeholder="Create a password"
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Days <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.preferredDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500">Select the days you prefer to teach</p>
              {form.preferredDays.length > 0 && (
                <p className="text-xs text-blue-600">
                  Selected: {form.preferredDays.join(', ')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectChoices">Subject Choice <span className="text-red-500">*</span></Label>
              <Input
                id="subjectChoices"
                name="subjectChoices"
                type="text"
                value={form.subjectChoices.join(', ')}
                onChange={handleChange}
                className="w-full"
                placeholder="Mathematics, Physics, Chemistry"
              />
              <p className="text-xs text-gray-500">Enter subjects</p>
            </div>
          </div>

          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertDescription>
                {validationError || error}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

