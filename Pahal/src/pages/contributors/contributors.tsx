import { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, X, Linkedin, Twitter, Globe } from 'lucide-react';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

interface Contributor {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  year: string;
  isInitiator: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// Temporary mock data - replace with actual API data later
const mockContributors: Contributor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    role: 'Founder & Initiative Lead',
    imageUrl: 'https://source.unsplash.com/random/400x400?portrait',
    bio: 'Started Pahal with a vision to transform education in rural areas',
    year: '2020',
    isInitiator: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      twitter: 'https://twitter.com/rajeshkumar',
      website: 'https://rajeshkumar.com'
    }
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Education Coordinator',
    imageUrl: 'https://source.unsplash.com/random/400x400?woman',
    bio: 'Dedicated volunteer who helped establish our first learning center',
    year: '2021',
    isInitiator: false,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priyasharma'
    }
  }
];

function AddContributorDialog() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    year: new Date().getFullYear().toString(),
    isInitiator: false,
    image: null as File | null,
    linkedin: '',
    twitter: '',
    website: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contributor addition logic
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Contributor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contributor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Photo</label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center">
              {formData.image ? (
                <div className="relative w-full">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="text-blue-500 hover:text-blue-600">Click to upload</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, image: file }));
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border p-2"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-md border p-2"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full rounded-md border p-2 min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full rounded-md border p-2"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isInitiator"
                checked={formData.isInitiator}
                onChange={(e) => setFormData(prev => ({ ...prev, isInitiator: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isInitiator" className="text-sm font-medium">
                Initiator/Founder
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Social Links (Optional)</h4>
            <div className="space-y-2">
              <label className="text-sm">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full rounded-md border p-2"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Twitter Profile</label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                className="w-full rounded-md border p-2"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full rounded-md border p-2"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Add Contributor</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Contributors() {
  const { teacher } = useTeacherAuth();
  const initiators = mockContributors.filter(c => c.isInitiator);
  const pastVolunteers = mockContributors.filter(c => !c.isInitiator);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Our Team</h1>
            <p className="mt-1 text-sm text-gray-500">Meet the people behind Pahal</p>
          </div>
          {teacher?.isAdmin && <AddContributorDialog />}
        </div>

        {/* Initiators Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Initiators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiators.map((person) => (
              <Card key={person.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-32 h-32 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold text-lg">{person.name}</h3>
                    <p className="text-sm text-blue-600 mb-2">{person.role}</p>
                    <p className="text-sm text-gray-600 mb-4">{person.bio}</p>
                    {person.socialLinks && (
                      <div className="flex space-x-4">
                        {person.socialLinks.linkedin && (
                          <a href={person.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                             className="text-gray-600 hover:text-blue-600">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {person.socialLinks.twitter && (
                          <a href={person.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                             className="text-gray-600 hover:text-blue-400">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {person.socialLinks.website && (
                          <a href={person.socialLinks.website} target="_blank" rel="noopener noreferrer"
                             className="text-gray-600 hover:text-gray-900">
                            <Globe className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Volunteers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Past Volunteers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastVolunteers.map((person) => (
              <Card key={person.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-sm text-blue-600 mb-1">{person.role}</p>
                    <p className="text-xs text-gray-500 mb-2">{person.year}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{person.bio}</p>
                    {person.socialLinks && (
                      <div className="flex space-x-4">
                        {person.socialLinks.linkedin && (
                          <a href={person.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                             className="text-gray-600 hover:text-blue-600">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
