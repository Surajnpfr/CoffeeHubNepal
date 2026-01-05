import { ArrowLeft, Award, CheckCircle, Clock, Upload, FileText } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';

const MOCK_CERTIFICATIONS = [
  {
    id: 1,
    name: "Organic Farming Certification",
    issuer: "Nepal Organic Certification",
    date: "2023-05-15",
    status: "verified",
    expiry: "2025-05-15"
  },
  {
    id: 2,
    name: "Coffee Quality Expert",
    issuer: "CoffeeHubNepal",
    date: "2023-08-20",
    status: "verified",
    expiry: null
  },
  {
    id: 3,
    name: "Fair Trade Certification",
    issuer: "Fair Trade Nepal",
    date: "2024-01-10",
    status: "pending",
    expiry: null
  }
];

export const Certifications = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button onClick={() => setCurrentPage('profile')} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37] flex-1">Expert Certifications</h2>
        <Button variant="primary" className="text-xs px-3">
          <Upload size={14} /> Add
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {MOCK_CERTIFICATIONS.map(cert => (
          <Card key={cert.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                cert.status === 'verified' ? 'bg-green-50' : 'bg-amber-50'
              }`}>
                <Award className={cert.status === 'verified' ? 'text-green-600' : 'text-amber-600'} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-base">{cert.name}</h3>
                  {cert.status === 'verified' ? (
                    <CheckCircle size={16} className="text-green-600" fill="currentColor" />
                  ) : (
                    <Clock size={16} className="text-amber-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">Issued by: {cert.issuer}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Issued: {new Date(cert.date).toLocaleDateString()}</span>
                  {cert.expiry && <span>Expires: {new Date(cert.expiry).toLocaleDateString()}</span>}
                </div>
              </div>
              <Badge variant={cert.status === 'verified' ? 'success' : 'primary'}>
                {cert.status === 'verified' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-xs">
                <FileText size={14} /> View Certificate
              </Button>
              {cert.status === 'pending' && (
                <Button variant="outline" className="text-xs text-red-600">
                  Cancel
                </Button>
              )}
            </div>
          </Card>
        ))}

        <Card className="p-6 border-dashed border-2 border-[#EBE3D5] text-center">
          <Upload className="mx-auto mb-3 text-gray-400" size={32} />
          <h3 className="font-black mb-2">Add New Certification</h3>
          <p className="text-xs text-gray-500 mb-4">Upload your certification documents</p>
          <Button variant="outline">
            <Upload size={16} /> Upload Certificate
          </Button>
        </Card>
      </div>
    </div>
  );
};

