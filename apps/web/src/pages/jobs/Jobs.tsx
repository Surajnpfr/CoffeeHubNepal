import { ArrowLeft, Home, Briefcase } from 'lucide-react';
import { JobCard } from '@/components/cards/JobCard';
import { MOCK_JOBS } from '@/utils/mockData';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { t } from '@/i18n';

export const Jobs = () => {
  const { navigate, setCurrentPage, language } = useApp();
  const { isAuthenticated } = useAuth();
  
  const handleJobClick = (id: number) => {
    navigate('job-detail', id);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-in fade-in pb-32 lg:pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black">{t(language, 'jobs.title')}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t(language, 'jobs.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button 
              variant="outline" 
              className="text-xs px-3"
              onClick={() => navigate('my-jobs')}
            >
              <Briefcase size={14} /> {t(language, 'jobs.myJobs')}
            </Button>
          )}
          <Button 
            variant="outline" 
            className="p-2 rounded-xl"
            onClick={() => setCurrentPage('home')}
          >
            <Home size={18} />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {MOCK_JOBS.map(job => (
          <JobCard key={job.id} job={job} onApply={() => handleJobClick(job.id)} />
        ))}
      </div>
    </div>
  );
};

