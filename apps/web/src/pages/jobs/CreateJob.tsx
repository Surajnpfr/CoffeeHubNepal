import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';

interface CreateJobProps {
  onBack: () => void;
  onSubmit?: (job: any) => void;
}

export const CreateJob = ({ onBack, onSubmit }: CreateJobProps) => {
  const [formData, setFormData] = useState({
    title: '',
    farm: '',
    location: '',
    pay: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    benefits: ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Seasonal', 'Contract'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37]">Post Job</h2>
      </div>

      <div className="p-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Job Title"
              placeholder="e.g. Seasonal Berry Pickers"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="Farm/Company Name"
                placeholder="Everest Coffee Estate"
                value={formData.farm}
                onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                  Job Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white border border-[#EBE3D5] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[#6F4E37]/10 text-sm"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="Location"
                placeholder="Kaski, Nepal"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />

              <Input
                type="text"
                label="Salary/Pay"
                placeholder="Rs. 800/day"
                value={formData.pay}
                onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                Job Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the job role and responsibilities..."
                className="w-full bg-white border border-[#EBE3D5] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[#6F4E37]/10 text-sm min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List the required qualifications and skills..."
                className="w-full bg-white border border-[#EBE3D5] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[#6F4E37]/10 text-sm min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                Benefits
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="List any benefits or perks..."
                className="w-full bg-white border border-[#EBE3D5] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[#6F4E37]/10 text-sm min-h-[100px]"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" type="button" onClick={onBack} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="flex-1">
                <Send size={16} /> Post Job
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

