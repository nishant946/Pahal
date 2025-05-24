import React, { useState } from 'react';

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

interface ContributorFormProps {
  initialData: Contributor;
  onSave: (contributor: Contributor) => void;
  onCancel: () => void;
}

const ContributorForm: React.FC<ContributorFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Contributor>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.type === 'checkbox' ? target.checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4 bg-white">
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Image URL</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          rows={3}
        />
      </div>
      <div>
        <label className="block font-semibold">Year</label>
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isInitiator"
          checked={formData.isInitiator}
          onChange={handleChange}
          id="isInitiator"
        />
        <label htmlFor="isInitiator" className="font-semibold">Is Initiator</label>
      </div>
      <div>
        <label className="block font-semibold">LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          value={formData.socialLinks?.linkedin || ''}
          onChange={handleSocialLinkChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Twitter</label>
        <input
          type="url"
          name="twitter"
          value={formData.socialLinks?.twitter || ''}
          onChange={handleSocialLinkChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block font-semibold">Website</label>
        <input
          type="url"
          name="website"
          value={formData.socialLinks?.website || ''}
          onChange={handleSocialLinkChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default ContributorForm;
