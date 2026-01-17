import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { jobService, Application, Job } from '@/services/job.service';
import { t } from '@/i18n';

export const MyApplications = () => {
  const { setSubPage, setCurrentPage, navigate, language } = useApp();
  const { user } = useAuth();
  const [applications, setApplications] = useState<(Application & { job?: Job | null })[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle back navigation properly
  const handleBack = useCallback(() => {
    setCurrentPage('jobs');
    setSubPage(null);
  }, [setCurrentPage, setSubPage]);

  useEffect(() => {
    loadMyApplications();
  }, [user]);

  const loadMyApplications = async () => {
    setLoading(true);
    try {
      const apps = await jobService.getMyApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    if (!jobId) return;
    sessionStorage.setItem('jobDetailId', jobId);
    navigate('job-detail', 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle size={12} /> {t(language, 'jobs.status.accepted')}</Badge>;
      case 'rejected':
        return <Badge variant="alert" className="flex items-center gap-1"><XCircle size={12} /> {t(language, 'jobs.status.rejected')}</Badge>;
      default:
        return <Badge variant="primary" className="flex items-center gap-1"><Clock size={12} /> {t(language, 'jobs.status.pending')}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-[#6F4E37]">{t(language, 'jobs.myApplications')}</h2>
          <p className="text-xs text-gray-500">{t(language, 'jobs.myApplicationsDesc')}</p>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <Card className="p-6">
            <p className="text-gray-500 text-center py-8">{t(language, 'common.loading')}</p>
          </Card>
        ) : applications.length === 0 ? (
          <Card className="p-6">
            <div className="text-center py-8">
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">{t(language, 'jobs.noApplications')}</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentPage('jobs');
                  setSubPage(null);
                }}
                className="mt-4"
              >
                {t(language, 'jobs.browseJobs')}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const appId = application._id || application.id || '';
              const job = application.job;
              
              return (
                <Card key={appId} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {job ? (
                        <>
                          <h3 className="font-black text-lg text-[#6F4E37] mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{job.farm} • {job.location}</p>
                        </>
                      ) : (
                        <h3 className="font-black text-lg text-[#6F4E37] mb-1">{t(language, 'jobs.jobDeleted')}</h3>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(application.status)}
                        <span className="text-xs text-gray-500">
                          {t(language, 'jobs.appliedOn')} {formatDate(application.appliedAt || application.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {application.message && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{application.message}</p>
                    </div>
                  )}

                  {job && (
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleJobClick(job._id || job.id || '')}
                        className="flex-1"
                      >
                        {t(language, 'jobs.viewJob')}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
