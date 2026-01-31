import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, X, MapPin, Calendar, User as UserIcon, Eye, FileImage } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { adminService, VerificationRequestWithUser, VerificationRequestDetail } from '@/services/admin.service';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export const Verifications = () => {
  const { setCurrentPage, setSubPage } = useApp();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || (!user || (user.role !== 'admin' && user.role !== 'moderator'))) {
      setCurrentPage('home');
      setSubPage(null);
    }
  }, [isAuthenticated, user, setCurrentPage, setSubPage]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return null;
  }

  const [verifications, setVerifications] = useState<VerificationRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detail, setDetail] = useState<VerificationRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadVerifications();
  }, [statusFilter]);

  const loadVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await adminService.getVerifications(statusFilter);
      setVerifications(list);
      const all = await adminService.getVerifications('all');
      setPendingCount(all.filter((r) => r.status === 'pending').length);
      setApprovedCount(all.filter((r) => r.status === 'approved').length);
    } catch (err: any) {
      setError(err.message || 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (userId: string) => {
    setSelectedUserId(userId);
    setDetail(null);
    setDetailLoading(true);
    try {
      const data = await adminService.getUserVerification(userId);
      setDetail(data ?? null);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedUserId(null);
    setDetail(null);
  };

  const handleApprove = async (userId: string) => {
    try {
      await adminService.verifyUser(userId);
      alert('User verified successfully!');
      closeDetail();
      await loadVerifications();
    } catch (err: any) {
      alert(err.message || 'Failed to approve verification');
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return;
    try {
      await adminService.rejectVerification(userId, reason || undefined);
      alert('Verification rejected.');
      closeDetail();
      await loadVerifications();
    } catch (err: any) {
      alert(err.message || 'Failed to reject verification');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const u = (v: VerificationRequestWithUser) => v.user;

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => {
            setCurrentPage('admin');
            setSubPage(null);
          }}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37]">Verifications</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-full text-xs font-black ${
              statusFilter === 'pending' ? 'bg-[#6F4E37] text-white' : 'bg-white border border-[#EBE3D5] text-gray-600'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-full text-xs font-black ${
              statusFilter === 'approved' ? 'bg-[#6F4E37] text-white' : 'bg-white border border-[#EBE3D5] text-gray-600'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-black ${
              statusFilter === 'all' ? 'bg-[#6F4E37] text-white' : 'bg-white border border-[#EBE3D5] text-gray-600'
            }`}
          >
            All
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-400 mt-4">Loading verifications...</p>
          </div>
        ) : verifications.length === 0 ? (
          <Card className="p-12 text-center">
            <UserIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 font-bold">No verification requests found</p>
          </Card>
        ) : (
          verifications.map((verification) => (
            <Card key={verification._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black mb-1">{u(verification).name || u(verification).email}</h3>
                  <p className="text-sm text-gray-600">{u(verification).email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={verification.status === 'approved' ? 'success' : 'primary'}>
                    {verification.status === 'approved' ? 'Approved' : 'Pending'}
                  </Badge>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 text-xs py-2"
                    onClick={() => openDetail(u(verification)._id)}
                  >
                    <Eye size={14} /> View
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {verification.organizationName && (
                  <div className="text-sm text-gray-600">
                    <strong>Organization:</strong> {verification.organizationName}
                  </div>
                )}
                {u(verification).location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-600">{u(verification).location}</span>
                  </div>
                )}
                {u(verification).phone && (
                  <div className="text-sm text-gray-600">
                    Phone: <strong>{u(verification).phone}</strong>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Role: <strong>{u(verification).role}</strong>
                </div>
                {u(verification).createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-600">Joined {formatTime(u(verification).createdAt)}</span>
                  </div>
                )}
              </div>

              {verification.status === 'pending' && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => handleReject(u(verification)._id)}>
                    <X size={16} /> Reject
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={() => handleApprove(u(verification)._id)}>
                    <CheckCircle size={16} /> Approve
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Detail panel: verification request + document images */}
      {selectedUserId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            className="bg-[#F8F5F2] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#F8F5F2] border-b border-[#EBE3D5] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#6F4E37]">Verification details</h3>
              <button onClick={closeDetail} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {detailLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : detail ? (
                <>
                  <div className="space-y-2">
                    <p><strong>Organization:</strong> {detail.organizationName}</p>
                    <p><strong>Role / Activity:</strong> {detail.roleDescription}</p>
                    <p><strong>Location:</strong> {detail.location}</p>
                    <p><strong>Years of experience:</strong> {detail.yearsOfExperience}</p>
                    {detail.certification && (
                      <p><strong>Certifications:</strong> {detail.certification}</p>
                    )}
                    <p className="text-xs text-gray-500">Submitted: {new Date(detail.submittedAt).toLocaleString()}</p>
                  </div>

                  {detail.documentUrls && detail.documentUrls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-black text-gray-700 mb-3 flex items-center gap-2">
                        <FileImage size={18} /> Document images
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {detail.documentUrls.map((url, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden border border-[#EBE3D5] bg-white">
                            <img
                              src={url}
                              alt={`Document ${idx + 1}`}
                              className="w-full h-48 object-contain"
                            />
                            <p className="text-xs text-gray-500 p-2 text-center">Document {idx + 1}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detail.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReject(detail.user._id)}
                      >
                        <X size={16} /> Reject
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleApprove(detail.user._id)}
                      >
                        <CheckCircle size={16} /> Approve
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-600">No verification request found for this user.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
