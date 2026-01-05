import { ArrowLeft, CheckCircle, X, FileText, MapPin, Calendar } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

const MOCK_VERIFICATIONS = [
  {
    id: 1,
    name: "Ram Thapa",
    farm: "Everest Coffee Estate",
    location: "Kaski, Gandaki",
    farmSize: "2.5 hectares",
    experience: "10 years",
    status: "pending",
    submitted: "2 days ago",
    documents: 3
  },
  {
    id: 2,
    name: "Sita Adhikari",
    farm: "Himalayan Beans",
    location: "Kathmandu",
    farmSize: "1.2 hectares",
    experience: "5 years",
    status: "pending",
    submitted: "3 days ago",
    documents: 2
  },
  {
    id: 3,
    name: "Hari Pokhrel",
    farm: "Green Valley Coffee",
    location: "Gulmi",
    farmSize: "3.0 hectares",
    experience: "15 years",
    status: "approved",
    submitted: "1 week ago",
    documents: 4
  }
];

export const Verifications = () => {
  const handleApprove = (id: number) => {
    console.log('Approve:', id);
  };

  const handleReject = (id: number) => {
    console.log('Reject:', id);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37]">Verifications</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full bg-[#6F4E37] text-white text-xs font-black">
            Pending (12)
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-[#EBE3D5] text-gray-600 text-xs font-black">
            Approved (89)
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-[#EBE3D5] text-gray-600 text-xs font-black">
            Rejected (5)
          </button>
        </div>

        {MOCK_VERIFICATIONS.map(verification => (
          <Card key={verification.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black mb-1">{verification.name}</h3>
                <p className="text-sm text-[#3A7D44] font-bold">{verification.farm}</p>
              </div>
              <Badge variant={verification.status === 'approved' ? 'success' : 'primary'}>
                {verification.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-gray-600">{verification.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Farm Size: <strong>{verification.farmSize}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Experience: <strong>{verification.experience}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText size={14} className="text-gray-400" />
                <span className="text-gray-600">{verification.documents} documents uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-gray-600">Submitted {verification.submitted}</span>
              </div>
            </div>

            {verification.status === 'pending' && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => handleReject(verification.id)}>
                  <X size={16} /> Reject
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => handleApprove(verification.id)}>
                  <CheckCircle size={16} /> Approve
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

