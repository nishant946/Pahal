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
}

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
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'preferredDays') {
      // Convert comma-separated string to array
      const daysArray = value.split(',').map(day => day.trim()).filter(day => day.length > 0);
      setForm((prev) => ({ ...prev, [name]: daysArray }));
    } else if (name === 'subjectChoices') {
      // Convert comma-separated string to array
      const subjectsArray = value.split(',').map(subject => subject.trim()).filter(subject => subject.length > 0);
      setForm((prev) => ({ ...prev, [name]: subjectsArray }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    setValidationError(null);
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.mobile || !form.rollNumber || !form.department) {
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
      setValidationError("Please enter at least one preferred day");
      return false;
    }
    if (form.subjectChoices.length === 0) {
      setValidationError("Please enter at least one subject choice");
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
              <Input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                className="w-full"
                placeholder="Information Technology, Civil Engineering, etc."
              />
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
              <Label htmlFor="preferredDays">Preferred Day <span className="text-red-500">*</span></Label>
              <Input
                id="preferredDays"
                name="preferredDays"
                type="text"
                value={form.preferredDays.join(', ')}
                onChange={handleChange}
                className="w-full"
                placeholder="Monday, Tuesday, Wednesday, Thursday, Friday"
              />
              <p className="text-xs text-gray-500">Enter your preferred day (e.g., Monday, Tuesday, Wednesday)</p>
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

