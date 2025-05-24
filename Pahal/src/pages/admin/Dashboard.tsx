import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, School, AlertCircle } from "lucide-react";


// This is the admin dashboard page. It displays various statistics and recent activities related to the admin panel.
// It uses the Card component to display information in a structured format.
// The dashboard includes:
// - Total number of teachers
// - Pending verifications
// - Total number of courses
// - Active students
// - Recent activities such as teacher verification requests, new courses added, and profile updates.

// The dashboard is styled using Tailwind CSS classes for a clean and modern look.
// The icons are imported from the lucide-react library for better visual representation of each statistic.
// The AdminLayout component is used to wrap the dashboard content, providing a consistent layout across the admin pages.


const AdminDashboard: React.FC = () => {
  return (
 
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Teacher verifications pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Teacher Verification Request", name: "Amit Kumar", time: "2 hours ago" },
              { action: "New Course Added", name: "Mathematics Grade 8", time: "5 hours ago" },
              { action: "Teacher Profile Updated", name: "Priya Sharma", time: "1 day ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.name}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default AdminDashboard;
