import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Eye, Ban, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { adminService } from '@/services/admin.service';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface Report {
  _id: string;
  postId: {
    _id: string;
    title: string;
    authorName: string;
  };
  reporterId: {
    _id: string;
    name?: string;
    email: string;
  };
  reportedUserId: {
    _id: string;
    name?: string;
    email: string;
  };
  reason: string;
  type: string;
  status: string;
  createdAt: string;
  reviewedBy?: {
    name?: string;
    email: string;
  };
  reviewedAt?: string;
}

export const Reports = () => {
  const { navigate, setCurrentPage, setSubPage } = useApp();
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
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');
  const [pendingCount, setPendingCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {
        page: 1,
        limit: 50
      };
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const result = await adminService.getReports(filters);
      setReports(result.reports || []);

      // Get counts
      const [pendingResult, reviewedResult] = await Promise.all([
        adminService.getReports({ status: 'pending', limit: 1 }),
        adminService.getReports({ status: 'reviewed', limit: 1 })
      ]);
      setPendingCount(pendingResult.pagination?.total || 0);
      setReviewedCount(reviewedResult.pagination?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: string, status: string) => {
    try {
      await adminService.updateReportStatus(reportId, status);
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Failed to update report status');
    }
  };

  const handleViewPost = (postId: string) => {
    // Store the MongoDB ObjectId in sessionStorage
    sessionStorage.setItem('blogDetailId', postId);
    // Navigate to blog detail - App.tsx will read from sessionStorage
    setCurrentPage('blog');
    setSubPage('blog-detail');
    // Use a numeric ID for navigation compatibility
    const numericId = parseInt(postId.slice(-8), 16) || Date.now();
    navigate('blog-detail', numericId);
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
        <h2 className="text-lg font-black text-[#6F4E37]">Reports</h2>
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
            onClick={() => setStatusFilter('reviewed')}
            className={`px-4 py-2 rounded-full text-xs font-black ${
              statusFilter === 'reviewed'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-white border border-[#EBE3D5] text-gray-600'
            }`}
          >
            Reviewed ({reviewedCount})
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
            <p className="text-sm text-gray-400 mt-4">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 font-bold">No reports found</p>
          </Card>
        ) : (
          reports.map(report => (
            <Card key={report._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    report.type === 'spam' ? 'bg-red-100 text-red-600' :
                    report.type === 'fraud' ? 'bg-orange-100 text-orange-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <Badge variant={report.type === 'spam' ? 'alert' : 'primary'} className="mb-1">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </Badge>
                    <p className="font-black text-sm">{report.postId?.title || 'Post'}</p>
                  </div>
                </div>
                <Badge variant={report.status === 'pending' ? 'alert' : 'success'}>
                  {report.status}
                </Badge>
              </div>

              <div className="bg-[#F8F5F2] p-4 rounded-xl mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reporter:</span>
                  <span className="font-black">{report.reporterId?.name || report.reporterId?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reported User:</span>
                  <span className="font-black">{report.reportedUserId?.name || report.reportedUserId?.email}</span>
                </div>
                <div className="pt-2 border-t border-[#EBE3D5]">
                  <p className="text-xs font-black text-gray-400 uppercase mb-1">Reason</p>
                  <p className="text-sm text-gray-700">{report.reason}</p>
                </div>
                <div className="pt-2 border-t border-[#EBE3D5]">
                  <p className="text-xs text-gray-500">Reported {formatTime(report.createdAt)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleViewPost(report.postId._id)}>
                  <Eye size={16} /> View Post
                </Button>
                {report.status === 'pending' && (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => handleStatusUpdate(report._id, 'dismissed')}>
                      <CheckCircle size={16} /> Dismiss
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => handleStatusUpdate(report._id, 'reviewed')}>
                      <Ban size={16} /> Mark Reviewed
                    </Button>
                  </>
                )}
                {report.status !== 'pending' && report.reviewedBy && (
                  <div className="text-xs text-gray-500 flex-1 flex items-center justify-end">
                    Reviewed by {report.reviewedBy.name || report.reviewedBy.email}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

