import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" type="text" placeholder="Enter site name" />
            </div>
            <div>
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input id="adminEmail" type="email" placeholder="Enter admin email" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch id="emailNotifications" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
            <Switch id="smsNotifications" />
          </div>
        </CardContent>
      </Card>

      <Button className="mt-4" variant="secondary">
        Save Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
