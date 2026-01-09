import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, X, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { adminService } from '@/services/admin.service';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/services/admin.service';

export const Verifications = () => {
  const { setCurrentPage, setSubPage } = useApp();
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not admin/moderator
  useEffect(() => {
    if (!isAuthenticated || (!user || (user.role !== 'admin' && user.role !== 'moderator'))) {
      setCurrentPage('home');
      setSubPage(null);
    }
  }, [isAuthenticated, user, setCurrentPage, setSubPage]);
  
  // Don't render if user doesn't have access
  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return null;
  }
  const [verifications, setVerifications] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    loadVerifications();
  }, [statusFilter]);

  const loadVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const pending = await adminService.getPendingVerifications();
      
      // Backend already filters for unverified users, but we do additional filtering here
      // Filter by status - ensure we only show truly unverified users
      let filtered = pending;
      if (statusFilter === 'pending') {
        // Only show users that are explicitly not verified
        filtered = pending.filter(u => u.verified === false || u.verified === null || u.verified === undefined);
      } else if (statusFilter === 'approved') {
        // This shouldn't happen since backend only returns unverified, but handle it
        filtered = pending.filter(u => u.verified === true);
      }
      
      setVerifications(filtered);
      
      // Get counts - backend only returns unverified, so pending count is the length
      setPendingCount(pending.filter(u => u.verified === false || u.verified === null || u.verified === undefined).length);
      setApprovedCount(pending.filter(u => u.verified === true).length);
    } catch (err: any) {
      setError(err.message || 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await adminService.verifyUser(userId);
      alert('User verified successfully!');
      await loadVerifications();
    } catch (err: any) {
      alert(err.message || 'Failed to approve verification');
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) {
      return; // User cancelled
    }
    
    try {
      await adminService.rejectVerification(userId, reason || undefined);
      alert('Verification rejected.');
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
              statusFilter === 'pending'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-white border border-[#EBE3D5] text-gray-600'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-full text-xs font-black ${
              statusFilter === 'approved'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-white border border-[#EBE3D5] text-gray-600'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-black ${
              statusFilter === 'all'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-white border border-[#EBE3D5] text-gray-600'
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
          verifications.map(verification => (
            <Card key={verification._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black mb-1">{verification.name || verification.email}</h3>
                  <p className="text-sm text-gray-600">{verification.email}</p>
                </div>
                <Badge variant={verification.verified ? 'success' : 'primary'}>
                  {verification.verified ? 'Approved' : 'Pending'}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                {verification.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-600">{verification.location}</span>
                  </div>
                )}
                {verification.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Phone: <strong>{verification.phone}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Role: <strong>{verification.role}</strong></span>
                </div>
                {verification.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-600">Joined {formatTime(verification.createdAt)}</span>
                  </div>
                )}
              </div>

              {!verification.verified && (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => handleReject(verification._id)}>
                    <X size={16} /> Reject
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={() => handleApprove(verification._id)}>
                    <CheckCircle size={16} /> Approve
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

