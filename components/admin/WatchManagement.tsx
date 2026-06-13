'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch } from '@/types';
import { addWatch, deleteWatch } from '@/lib/watches';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Upload, Loader2, X } from 'lucide-react';

interface WatchManagementProps {
  watches: Watch[];
  onUpdate: () => void;
}

export default function WatchManagement({ watches, onUpdate }: WatchManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if file is selected
      if (imageFile) {
        const storageRef = ref(storage, `watches/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addWatch({
        brand: formData.brand,
        model: formData.model,
        description: formData.description,
        image: imageUrl,
      });

      // Reset form
      setFormData({ brand: '', model: '', description: '', imageUrl: '' });
      setImageFile(null);
      setShowAddModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding watch:', error);
      alert('Failed to add watch');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(watchId: string) {
    if (!confirm('Are you sure you want to delete this watch?')) return;

    setDeleting(watchId);
    try {
      await deleteWatch(watchId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting watch:', error);
      alert('Failed to delete watch');
    } finally {
      setDeleting(null);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Watch Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Watches</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-lg
            hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Watch
        </button>
      </div>

      {/* Watches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watches.map((watch) => (
          <motion.div
            key={watch.id}
            layout
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <div className="relative h-48 bg-zinc-950">
              <img
                src={watch.image}
                alt={`${watch.brand} ${watch.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-amber-500 text-sm font-medium uppercase mb-1">
                {watch.brand}
              </p>
              <h3 className="text-white font-semibold mb-2">{watch.model}</h3>
              {watch.description && (
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                  {watch.description}
                </p>
              )}
              <button
                onClick={() => handleDelete(watch.id)}
                disabled={deleting === watch.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg
                  hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {deleting === watch.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {watches.length === 0 && (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-zinc-400 text-lg mb-4">No watches added yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-amber-500 hover:text-amber-400"
          >
            Add your first watch
          </button>
        </div>
      )}

      {/* Add Watch Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Add New Watch</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white
                      focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white
                      focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white
                      focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Image
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-lg
                      hover:border-amber-500 transition-colors cursor-pointer">
                      <Upload className="w-5 h-5 text-zinc-400" />
                      <span className="text-zinc-400">
                        {imageFile ? imageFile.name : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    <div className="text-center text-zinc-500 text-sm">or</div>

                    <input
                      type="url"
                      value={imageFile ? '' : formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Enter image URL"
                      disabled={!!imageFile}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white
                        focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
                    />

                    {formData.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || (!formData.imageUrl && !imageFile)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-lg
                      hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Watch'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
