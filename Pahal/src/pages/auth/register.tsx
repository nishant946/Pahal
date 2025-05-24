import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReloadIcon } from "@radix-ui/react-icons";

interface FormState {
  name: string;
  employeeId: string;
  email: string;
  department: string;
  designation: string;
  password: string;
  confirmPassword: string;
  phone: string;
  qualification: string;
}

const Register = () => {  const navigate = useNavigate();
  const { register, loading, error } = useTeacherAuth();
  const [form, setForm] = useState<FormState>({
    name: "",
    employeeId: "",
    email: "",
    department: "",
    designation: "",
    password: "",
    confirmPassword: "",
    phone: "",
    qualification: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validateForm = () => {
    if (!form.name || !form.employeeId || !form.email || !form.password || !form.confirmPassword) {      setValidationError("All fields marked with * are required");
      return false;
    }
    if (form.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registrationData } = form;
      await register({ ...registrationData, isAdmin: false, isVerified: false });
      navigate('/login', { state: { message: 'Registration successful! Please login to continue.' } });
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div>
          <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and help shape young minds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
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
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                name="employeeId"
                type="text"
                required
                value={form.employeeId}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your employee ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                className="w-full"
                placeholder="E.g., Mathematics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                name="designation"
                type="text"
                value={form.designation}
                onChange={handleChange}
                className="w-full"
                placeholder="E.g., Senior Teacher"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                name="qualification"
                type="text"
                value={form.qualification}
                onChange={handleChange}
                className="w-full"
                placeholder="E.g., M.Sc. Mathematics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
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
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full"
                placeholder="Confirm your password"
              />
            </div>
          </div>          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertDescription>
                {validationError || error}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Button type="submit" disabled={loading} className="w-full">
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
