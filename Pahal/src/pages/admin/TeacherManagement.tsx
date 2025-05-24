import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, UserPlus, Edit, Trash2 } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: 'verified' | 'pending' | 'rejected';
  joinDate: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      subject: "Mathematics",
      status: "verified",
      joinDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      subject: "Science",
      status: "pending",
      joinDate: "2023-05-20"
    }
  ]);

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
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <input
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                    placeholder="Enter teacher's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <input
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                    placeholder="Enter subject"
                  />
                </div>
              </div>
              <Button className="w-full">Add Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{teacher.name}</p>
                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                  <p className="text-sm text-muted-foreground">Subject: {teacher.subject}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {teacher.status === 'verified' ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Verified
                    </span>
                  ) : teacher.status === 'pending' ? (
                    <span className="flex items-center text-yellow-600">
                      Pending
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="mr-1 h-4 w-4" />
                      Rejected
                    </span>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
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
