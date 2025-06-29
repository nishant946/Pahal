import { useState } from "react";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User } from "lucide-react";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";

export default function Settings() {
  const { teacher } = useTeacherAuth();
  const [profile, setProfile] = useState({
    name: teacher?.name,
    email: teacher?.email,
    phone: teacher?.mobileNo,
    subjectChoices: teacher?.subjectChoices || [],
    preferredDays: teacher?.preferredDays || [],
  });
  // const [avatar, setAvatar] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic here
  };

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (ev) => {
  //       setAvatar(ev.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleAvatarClick = () => {
  //   fileInputRef.current?.click();
  // };

  return (
    <Layout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Edit Profile</h1>
          <p className="text-sm text-gray-700">Update your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectChoices">Subject Choices</Label>
                <Input
                  id="subjectChoices"
                  value={profile.subjectChoices.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      subjectChoices: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Mathematics, Physics, Chemistry"
                />
                <p className="text-xs text-gray-500">Enter subjects separated by commas (e.g., Mathematics, Physics)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredDays">Preferred Days</Label>
                <Input
                  id="preferredDays"
                  value={profile.preferredDays.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredDays: e.target.value.split(",").map(d => d.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Monday, Tuesday, Wednesday"
                />
                <p className="text-xs text-gray-500">Enter days separated by commas (e.g., Monday, Tuesday, Wednesday)</p>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
