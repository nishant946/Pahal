import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, UserPlus,Trash2, Search } from "lucide-react";
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import api from '@/services/api';

interface Teacher {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  isVerified: boolean;
  isActive: boolean;
  joiningDate: string;
  createdAt: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const { verifyTeacher } = useTeacherAuth();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/teachers');
      setTeachers(response.data.teachers);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (teacherId: string) => {
    try {
      await verifyTeacher(teacherId);
      // Update the local state
      setTeachers(prev => prev.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, isVerified: true }
          : teacher
      ));
    } catch (err) {
      setError('Failed to verify teacher');
    }
  };

  const handleDeactivate = async (teacherId: string) => {
    try {
      await api.patch(`/admin/teachers/${teacherId}/deactivate`);
      // Update the local state
      setTeachers(prev => prev.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, isActive: false }
          : teacher
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to deactivate teacher');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && teacher.isVerified) ||
                         (filterStatus === 'unverified' && !teacher.isVerified);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Teacher Management</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Teacher Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Teachers can register themselves through the registration page. 
                You can then verify them from the Teacher Verification section.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Teachers</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List ({filteredTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No teachers found
              </div>
            ) : (
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{teacher.name}</p>
                      {teacher.isVerified && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.department} • {teacher.designation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Roll No: {teacher.rollNo} • Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {teacher.isVerified ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600 text-sm">
                        Pending
                      </span>
                    )}
                    {!teacher.isVerified && (
                      <Button 
                        size="sm" 
                        onClick={() => handleVerify(teacher._id)}
                        className="text-xs"
                      >
                        Verify
                      </Button>
                    )}
                    {teacher.isActive && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeactivate(teacher._id)}
                        className="text-xs text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          Teachers need to be verified before they can access the platform. You can manage verifications in the Teacher Verification section.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TeacherManagement;
