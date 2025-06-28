import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, LogOut } from 'lucide-react';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

const PendingVerification = () => {
  const { teacher, logout } = useTeacherAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                Thank you for registering! Your account is currently under review by our administrators. 
                You will be able to access the platform once your account is verified.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {teacher?.name}
                </h3>
                <p className="text-sm text-gray-600">{teacher?.email}</p>
                <p className="text-sm text-gray-600">{teacher?.department}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Admin will review your registration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    You'll receive access once verified
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    You can log in anytime to check status
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="flex-1"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Button 
                  onClick={() => window.location.href = '/login'} 
                  className="flex-1"
                >
                  Try Login Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingVerification; 