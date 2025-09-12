import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, User, Mail, Phone, Building, Clock } from "lucide-react";
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import { SkeletonCard } from "@/components/ui/skeleton";

interface Teacher {
  _id: string;
  rollNo: string;
  name: string;
  mobileNo: string;
  email: string;
  department: string;
  preferredDays: string[];
  subjectChoices: string[];
  designation: string;
  qualification?: string;
  joiningDate: string;
  isVerified: boolean;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TeacherVerification: React.FC = () => {
  const { getUnverifiedTeachers, verifyTeacher } = useTeacherAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    fetchUnverifiedTeachers();
  }, []);

  const fetchUnverifiedTeachers = async () => {
    try {
      setLoading(true);
      const unverifiedTeachers = await getUnverifiedTeachers();
      setTeachers(unverifiedTeachers);
    } catch (err) {
      setError('Failed to fetch unverified teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (teacherId: string) => {
    try {
      setVerifying(teacherId);
      await verifyTeacher(teacherId);
      // Remove the verified teacher from the list
      setTeachers(prev => prev.filter(teacher => teacher._id !== teacherId));
    } catch (err) {
      setError('Failed to verify teacher');
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} showButton={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Teacher Verification</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {teachers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Verifications</h3>
            <p className="text-muted-foreground">All teachers have been verified!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Verifications ({teachers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium text-foreground">{teacher.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {teacher.mobileNo}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        {teacher.department}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Roll No: {teacher.rollNo} • Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleVerify(teacher._id)}
                      disabled={verifying === teacher._id}
                    >
                      {verifying === teacher._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" />
                      )}
                      {verifying === teacher._id ? 'Verifying...' : 'Approve'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherVerification;
