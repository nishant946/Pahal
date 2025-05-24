import { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus } from 'lucide-react';
import ContributorForm from '@/components/admin/ContributorForm';


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

const initialContributors: Contributor[] = [
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
  }
];

export default function AdminContributors() {
  
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors);
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null);

  const deleteContributor = (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this contributor?");
    if (confirmed) {
      setContributors(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = (updatedContributor: Contributor) => {
    if (editingContributor) {
      setContributors(prev =>
        prev.map(c => (c.id === updatedContributor.id ? updatedContributor : c))
      );
    } else {
      setContributors(prev => [...prev, { ...updatedContributor, id: Date.now().toString() }]);
    }
    setEditingContributor(null);
  };

  const handleCancel = () => setEditingContributor(null);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Contributors</h1>
          <Button onClick={() => setEditingContributor({ 
            id: '', name: '', role: '', imageUrl: '', bio: '', year: new Date().getFullYear().toString(), isInitiator: false 
          })}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contributor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map(c => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <img src={c.imageUrl} className="w-24 h-24 rounded-full object-cover mb-2" />
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-blue-600">{c.role}</p>
                  <p className="text-xs text-gray-500 mb-2">{c.year}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{c.bio}</p>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="icon" onClick={() => setEditingContributor(c)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => deleteContributor(c.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingContributor && (
          <ContributorForm
            initialData={editingContributor}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </Layout>
  );
}
