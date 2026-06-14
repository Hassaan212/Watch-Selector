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
        <h2 className="text-2xl font-bold text-white tracking-tight">Manage Watches</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 glass-button rounded-[16px] font-semibold
            transition-all duration-300"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add Watch
        </button>
      </div>

      {/* Watches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watches.map((watch) => (
          <motion.div
            key={watch.id}
            layout
            whileHover={{ y: -4 }}
            className="glass-panel glass-panel-hover rounded-[24px] overflow-hidden"
          >
            <div className="relative h-48 bg-black/20">
              <img
                src={watch.image}
                alt={`${watch.brand} ${watch.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-4">
              <p className="text-gold text-sm font-medium uppercase tracking-wider mb-1">
                {watch.brand}
              </p>
              <h3 className="text-white font-semibold mb-2">{watch.model}</h3>
              {watch.description && (
                <p className="text-white/50 text-sm mb-4 line-clamp-2">
                  {watch.description}
                </p>
              )}
              <button
                onClick={() => handleDelete(watch.id)}
                disabled={deleting === watch.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 glass-panel rounded-[12px]
                  text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {deleting === watch.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                )}
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {watches.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-[24px]">
          <p className="text-white/60 text-lg mb-4">No watches added yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-gold hover:text-gold/80 transition-colors"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)'
            }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-[30px] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Add New Watch</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="glass-panel p-2 rounded-[12px] text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-3 glass-input rounded-[16px] text-white
                      focus:outline-none transition-all duration-300 placeholder:text-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-3 glass-input rounded-[16px] text-white
                      focus:outline-none transition-all duration-300 placeholder:text-white/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 glass-input rounded-[16px] text-white
                      focus:outline-none transition-all duration-300 resize-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Image
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-4 glass-panel rounded-[16px]
                      hover:bg-white/5 transition-colors cursor-pointer border-2 border-dashed border-white/10">
                      <Upload className="w-5 h-5 text-white/60" strokeWidth={1.5} />
                      <span className="text-white/60">
                        {imageFile ? imageFile.name : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    <div className="text-center text-white/40 text-sm">or</div>

                    <input
                      type="url"
                      value={imageFile ? '' : formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Enter image URL"
                      disabled={!!imageFile}
                      className="w-full px-4 py-3 glass-input rounded-[16px] text-white
                        focus:outline-none transition-all duration-300 disabled:opacity-50 placeholder:text-white/30"
                    />

                    {formData.imageUrl && (
                      <div className="mt-3 rounded-[16px] overflow-hidden glass-panel">
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
                    className="flex-1 px-4 py-3 glass-panel glass-panel-hover rounded-[16px] text-white font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || (!formData.imageUrl && !imageFile)}
                    className="flex-1 px-4 py-3 glass-button rounded-[16px] font-semibold
                      transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
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
