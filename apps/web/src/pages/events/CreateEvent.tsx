import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, X, Upload, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Textarea } from '@/components/common/Textarea';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { eventService } from '@/services/event.service';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { compressImage } from '@/utils/imageCompression';

interface CreateEventProps {
  onBack: () => void;
  onSubmit?: (event: any) => void;
}

const EVENT_TYPES = ['Festival', 'Workshop', 'Training', 'Conference', 'Other'];

export const CreateEvent = ({ onBack, onSubmit }: CreateEventProps) => {
  const { navigate } = useApp();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    address: '',
    type: EVENT_TYPES[0],
    image: '',
    organizer: '',
    contact: '',
    maxAttendees: '',
    agenda: [] as string[]
  });
  const [agendaItem, setAgendaItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('login');
    return null;
  }

  // Set organizer to user's name by default
  if (!formData.organizer && user.name) {
    setFormData(prev => ({ ...prev, organizer: user.name }));
  }

  const handleImageUpload = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG or WebP images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const compressedDataUrl = await compressImage(file, 1920, 1920, 0.8, 1000);
      setFormData(prev => ({ ...prev, image: compressedDataUrl }));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const addAgendaItem = () => {
    if (agendaItem.trim()) {
      setFormData(prev => ({
        ...prev,
        agenda: [...prev.agenda, agendaItem.trim()]
      }));
      setAgendaItem('');
    }
  };

  const removeAgendaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate date is in the future
      const eventDate = new Date(formData.date);
      if (eventDate < new Date()) {
        setError('Event date must be in the future');
        setLoading(false);
        return;
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time.trim(),
        location: formData.location.trim(),
        address: formData.address.trim() || undefined,
        type: formData.type,
        image: formData.image || undefined,
        organizer: formData.organizer.trim(),
        contact: formData.contact.trim() || undefined,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        agenda: formData.agenda.length > 0 ? formData.agenda : undefined
      };

      const createdEvent = await eventService.createEvent(eventData);
      onSubmit?.(createdEvent);
      // Navigate back to events list
      onBack();
    } catch (err: any) {
      console.error('Failed to create event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37]">Create Event</h2>
      </div>

      <div className="p-6">
        <Card className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Event Title"
              placeholder="e.g. Coffee Festival 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={200}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe your event..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              maxLength={5000}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                  required
                />
              </div>

              <Input
                type="text"
                label="Time"
                placeholder="e.g. 9:00 AM - 6:00 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                maxLength={100}
                required
              />
            </div>

            <Input
              type="text"
              label="Location"
              placeholder="e.g. Kathmandu, Nepal"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              maxLength={200}
              required
            />

            <Input
              type="text"
              label="Address (Optional)"
              placeholder="Full address or venue name"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              maxLength={500}
            />

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                required
              >
                {EVENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                Event Image
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    uploadMode === 'url'
                      ? 'bg-[#6F4E37] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <LinkIcon size={16} className="inline mr-2" />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    uploadMode === 'upload'
                      ? 'bg-[#6F4E37] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload size={16} className="inline mr-2" />
                  Upload
                </button>
              </div>

              {uploadMode === 'url' ? (
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#6F4E37] bg-[#6F4E37]/5'
                      : 'border-gray-300 hover:border-[#6F4E37]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, image: '' });
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click or drag image here</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 5MB)</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Organizer"
                placeholder="Your name or organization"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                maxLength={200}
                required
              />

              <Input
                type="text"
                label="Contact (Optional)"
                placeholder="Email or phone"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                maxLength={100}
              />
            </div>

            <Input
              type="number"
              label="Max Attendees (Optional)"
              placeholder="Leave empty for unlimited"
              value={formData.maxAttendees}
              onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              min={1}
            />

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                Event Agenda (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add agenda item..."
                  value={agendaItem}
                  onChange={(e) => setAgendaItem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAgendaItem();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAgendaItem}
                  className="shrink-0"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {formData.agenda.length > 0 && (
                <div className="space-y-2">
                  {formData.agenda.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="flex-1 text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {loading && <LoadingOverlay />}
    </div>
  );
};
