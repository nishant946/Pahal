import { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, X } from 'lucide-react';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  date: string;
}

// Temporary mock data - replace with actual API data later
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    imageUrl: 'https://source.unsplash.com/random/800x600?education',
    title: 'Annual Day Celebration',
    description: 'Students performing at the annual day celebration',
    date: '2025-05-15'
  },
  {
    id: '2',
    imageUrl: 'https://source.unsplash.com/random/800x600?school',
    title: 'Science Exhibition',
    description: 'Students showcasing their science projects',
    date: '2025-05-10'
  }
];

function AddPhotoDialog() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement photo upload logic
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Photo</DialogTitle>
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
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border p-2 min-h-[100px]"
              required
            />
          </div>
          <Button type="submit" className="w-full">Upload Photo</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Gallery() {
  const { teacher } = useTeacherAuth();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
            <p className="mt-1 text-sm text-gray-500">Browse through our memories</p>
          </div>
          {teacher?.isAdmin && <AddPhotoDialog />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGalleryItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-video relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Preview Dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full rounded-lg"
                />
                <p className="text-gray-600">{selectedImage.description}</p>
                <p className="text-sm text-gray-400">
                  Added on {new Date(selectedImage.date).toLocaleDateString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
