import React, { useState } from 'react';

interface GalleryCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const Gallary: React.FC = () => {
  const [galleryCards, setGalleryCards] = useState<GalleryCard[]>([]);
  const [editingCard, setEditingCard] = useState<GalleryCard | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '' });
    setEditingCard(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdate = () => {
    if (!formData.title || !formData.description || !formData.imageUrl) {
      alert('Please fill all fields and select an image.');
      return;
    }
    if (editingCard) {
      // Update existing card
      setGalleryCards((prev) =>
        prev.map((card) =>
          card.id === editingCard.id ? { ...editingCard, ...formData } : card
        )
      );
    } else {
      // Add new card
      const newCard: GalleryCard = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
      };
      setGalleryCards((prev) => [...prev, newCard]);
    }
    resetForm();
  };

  const handleEdit = (card: GalleryCard) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this gallery card?')) {
      setGalleryCards((prev) => prev.filter((card) => card.id !== id));
      if (editingCard && editingCard.id === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gallery Management</h1>

      <div className="mb-6 p-4 border rounded shadow-sm bg-white max-w-md">
        <h2 className="text-xl font-semibold mb-2">
          {editingCard ? 'Edit Gallery Card' : 'Add Gallery Card'}
        </h2>
        <div className="mb-2">
          <label className="block mb-1 font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
            rows={3}
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1 font-medium" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="mt-2 max-h-40 object-contain"
            />
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAddOrUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingCard ? 'Update' : 'Add'}
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {galleryCards.map((card) => (
          <div
            key={card.id}
            className="border rounded shadow-sm p-4 bg-white flex flex-col"
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="mb-2 max-h-48 object-cover rounded"
            />
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-gray-700 flex-grow">{card.description}</p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEdit(card)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;
