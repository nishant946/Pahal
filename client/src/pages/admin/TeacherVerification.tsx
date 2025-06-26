import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Eye } from "lucide-react";

interface VerificationRequest {
  id: string;
  teacherName: string;
  email: string;
  subject: string;
  documents: string[];
  submissionDate: string;
}

const TeacherVerification: React.FC = () => {
  const verificationRequests: VerificationRequest[] = [
    {
      id: "1",
      teacherName: "Amit Kumar",
      email: "amit.kumar@example.com",
      subject: "Physics",
      documents: ["ID_Proof.pdf", "Degree_Certificate.pdf"],
      submissionDate: "2023-05-20"
    },
    {
      id: "2",
      teacherName: "Neha Patel",
      email: "neha.patel@example.com",
      subject: "Chemistry",
      documents: ["ID_Card.pdf", "Teaching_Certificate.pdf"],
      submissionDate: "2023-05-19"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Teacher Verification</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 border rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{request.teacherName}</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                    <p className="text-sm text-muted-foreground">Subject: {request.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(request.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Documents
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Verification Documents</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {request.documents.map((doc, index) => (
                            <div key={index} className="p-3 border rounded flex justify-between items-center">
                              <span>{doc}</span>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1" variant="outline">
                    <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" />
                    Approve
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <XCircle className="mr-1 h-4 w-4 text-red-600" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherVerification;
