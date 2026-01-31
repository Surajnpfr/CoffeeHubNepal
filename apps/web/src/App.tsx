import { useEffect, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { t } from './i18n';
import { Header } from './components/layout/Header';
import { DesktopHeader } from './components/layout/DesktopHeader';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { CreateMenu } from './components/common/CreateMenu';
import { VerificationBanner } from './components/common/VerificationBanner';
import { useMediaQuery } from './hooks/useMediaQuery';

// Constants moved outside component for stable identity and performance
const PROTECTED_PAGES = new Set(['market', 'jobs', 'profile', 'notices', 'blog', 'prices']);
const PUBLIC_PAGES = new Set(['about', 'contact', 'privacy', 'terms']);
const PROTECTED_SUB_PAGES = new Set([
  'blog-detail', 'create-blog', 'edit-blog',
  'create-listing', 'listing-detail',
  'notice-detail', 'create-notice',
  'job-detail', 'create-job',
  'my-listings', 'my-jobs', 'my-applications', 'certifications', 'settings'
]);

// Core pages - loaded immediately
import { Home } from './pages/home/Home';
import { LandingPage } from './pages/landing/LandingPage';

// Lazy-loaded pages for better initial load time
const Marketplace = lazy(() => import('./pages/marketplace/Marketplace').then(m => ({ default: m.Marketplace })));
const Jobs = lazy(() => import('./pages/jobs/Jobs').then(m => ({ default: m.Jobs })));
const Profile = lazy(() => import('./pages/profile/Profile').then(m => ({ default: m.Profile })));
const Notices = lazy(() => import('./pages/notices/Notices').then(m => ({ default: m.Notices })));
const BlogList = lazy(() => import('./pages/blog/BlogList').then(m => ({ default: m.BlogList })));
const BlogDetail = lazy(() => import('./pages/blog/BlogDetail').then(m => ({ default: m.BlogDetail })));
const CreateBlog = lazy(() => import('./pages/blog/CreateBlog').then(m => ({ default: m.CreateBlog })));
const EditBlog = lazy(() => import('./pages/blog/EditBlog').then(m => ({ default: m.EditBlog })));
const CreateListing = lazy(() => import('./pages/marketplace/CreateListing').then(m => ({ default: m.CreateListing })));
const NoticeDetail = lazy(() => import('./pages/notices/NoticeDetail').then(m => ({ default: m.NoticeDetail })));
const CreateNotice = lazy(() => import('./pages/notices/CreateNotice').then(m => ({ default: m.CreateNotice })));
const JobDetail = lazy(() => import('./pages/jobs/JobDetail').then(m => ({ default: m.JobDetail })));
const CreateJob = lazy(() => import('./pages/jobs/CreateJob').then(m => ({ default: m.CreateJob })));
const PriceBoard = lazy(() => import('./pages/prices/PriceBoard').then(m => ({ default: m.PriceBoard })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const FarmerVerification = lazy(() => import('./pages/auth/FarmerVerification').then(m => ({ default: m.FarmerVerification })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const CompleteSignup = lazy(() => import('./pages/auth/CompleteSignup').then(m => ({ default: m.CompleteSignup })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const Verifications = lazy(() => import('./pages/admin/Verifications').then(m => ({ default: m.Verifications })));
const Reports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.Reports })));
const Users = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.Users })));
const Prices = lazy(() => import('./pages/admin/Prices').then(m => ({ default: m.Prices })));
const Contacts = lazy(() => import('./pages/admin/Contacts').then(m => ({ default: m.Contacts })));
const AdminMarketplace = lazy(() => import('./pages/admin/Marketplace').then(m => ({ default: m.Marketplace })));
const MyListings = lazy(() => import('./pages/profile/MyListings').then(m => ({ default: m.MyListings })));
const MyJobs = lazy(() => import('./pages/jobs/MyJobs').then(m => ({ default: m.MyJobs })));
const MyApplications = lazy(() => import('./pages/jobs/MyApplications').then(m => ({ default: m.MyApplications })));
const Certifications = lazy(() => import('./pages/profile/Certifications').then(m => ({ default: m.Certifications })));
const Settings = lazy(() => import('./pages/profile/Settings').then(m => ({ default: m.Settings })));
const AboutUs = lazy(() => import('./pages/about/AboutUs').then(m => ({ default: m.AboutUs })));
const ContactUs = lazy(() => import('./pages/contact/ContactUs').then(m => ({ default: m.ContactUs })));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { currentPage, setCurrentPage, subPage, setSubPage, selectedId, setSelectedId, isMenuOpen, setIsMenuOpen, navigate, setUserRole, setReplaceNext, language } = useApp();
  const { user, isAuthenticated, isLoading } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Sync user role from auth context
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user, setUserRole]);

  // Redirect unauthenticated users from protected pages (Task A: moved to useEffect)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect if trying to access protected page (home is handled separately - shows landing page)
      if (PROTECTED_PAGES.has(currentPage) && !subPage) {
        setReplaceNext(true); // Replace URL so back button doesn't return to protected page
        setCurrentPage('home');
        setSubPage('login');
      }
    }
  }, [isAuthenticated, isLoading, currentPage, subPage, setCurrentPage, setSubPage, setReplaceNext]);

  // Redirect unauthenticated users from protected sub-pages (Task A: moved to useEffect)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && subPage && PROTECTED_SUB_PAGES.has(subPage)) {
      setReplaceNext(true);
      setCurrentPage('home');
      setSubPage('login');
    }
  }, [isAuthenticated, isLoading, subPage, setCurrentPage, setSubPage, setReplaceNext]);

  // Redirect non-admin/moderator users from admin pages (Task A: moved to useEffect)
  useEffect(() => {
    if (currentPage === 'admin' && !isLoading) {
      if (!isAuthenticated) {
        setReplaceNext(true);
        setCurrentPage('home');
        setSubPage('login');
      } else {
        const userRole = user?.role;
        if (userRole !== 'admin' && userRole !== 'moderator') {
          setCurrentPage('home');
          setSubPage(null);
        }
      }
    }
  }, [currentPage, isAuthenticated, isLoading, user?.role, setCurrentPage, setSubPage]);

  // Handle URL-based navigation for reset password and complete signup (from email links)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const pathname = window.location.pathname;
    
    // Check if URL has complete-signup path
    if (pathname.includes('complete-signup')) {
      setSubPage('complete-signup');
      return;
    }
    
    // Check if URL has reset-password path or token parameter (for password reset)
    if (pathname.includes('reset-password') || token) {
      setSubPage('reset-password');
      // Store token in sessionStorage so ResetPassword component can access it
      if (token) {
        sessionStorage.setItem('resetPasswordToken', token);
      }
    }
  }, [setSubPage]);

  const handleMenuSelect = (option: string) => {
    setIsMenuOpen(false);
    switch (option) {
      case 'sell':
        navigate('create-listing');
        break;
      case 'notice':
        navigate('create-notice');
        break;
      case 'job':
        navigate('create-job');
        break;
      case 'blog':
        navigate('create-blog');
        break;
    }
  };

  const handleBack = () => {
    // Handle back navigation based on current subPage
    switch (subPage) {
      case 'create-listing':
      case 'listing-detail':
        setCurrentPage('market');
        break;
      case 'blog-detail':
      case 'create-blog':
      case 'edit-blog':
        setCurrentPage('blog');
        break;
      case 'job-detail':
      case 'create-job':
        setCurrentPage('jobs');
        break;
      case 'my-listings':
      case 'my-jobs':
      case 'settings':
      case 'certifications':
        setCurrentPage('profile');
        break;
      default:
        // For other pages, go back to home
        break;
    }
    setSubPage(null);
    setSelectedId(null);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">{t(language, 'common.loading')}</p>
        </div>
      </div>
    );
  }

  // Public pages (accessible without login) - about, contact, privacy, terms (from URL currentPage or subPage)
  const onPublicPage = !isAuthenticated && (PUBLIC_PAGES.has(currentPage) || (subPage && PUBLIC_PAGES.has(subPage)));
  if (onPublicPage) {
    return (
      <div className="min-h-screen bg-[#F8F5F2]">
        <Suspense fallback={<PageLoader />}>
          {(currentPage === 'about' || subPage === 'about') && <AboutUs />}
          {(currentPage === 'contact' || subPage === 'contact') && <ContactUs />}
          {(currentPage === 'privacy' || subPage === 'privacy') && <PrivacyPolicy />}
          {(currentPage === 'terms' || subPage === 'terms') && <TermsOfService />}
        </Suspense>
      </div>
    );
  }

  // Landing page (show when not authenticated and on home)
  if (currentPage === 'home' && !isAuthenticated && !subPage) {
    return <LandingPage />;
  }

  // Protected pages - require authentication
  // useEffect above handles redirect, but show loading if somehow we're still on protected page
  if (!isAuthenticated && PROTECTED_PAGES.has(currentPage) && !subPage) {
    // Show loading while redirect happens (useEffect will handle redirect)
    return <PageLoader />;
  }

  // Admin pages - check if user should be redirected (useEffect handles redirect, this is just for rendering)
  const isAdminOrModerator = user?.role === 'admin' || user?.role === 'moderator';
  const shouldShowAdmin = currentPage === 'admin' && isAuthenticated && isAdminOrModerator;

  // Auth pages (always full screen) - wrapped in Suspense for lazy loading
  if (subPage === 'login') {
    return <Suspense fallback={<PageLoader />}><Login onBack={handleBack} onSuccess={() => setSubPage(null)} /></Suspense>;
  }
  if (subPage === 'register') {
    return <Suspense fallback={<PageLoader />}><Register onBack={handleBack} onSuccess={() => setSubPage(null)} /></Suspense>;
  }
  if (subPage === 'verification') {
    return <Suspense fallback={<PageLoader />}><FarmerVerification onBack={handleBack} onSuccess={() => setSubPage(null)} /></Suspense>;
  }
  if (subPage === 'forgot-password') {
    return <Suspense fallback={<PageLoader />}><ForgotPassword onBack={handleBack} /></Suspense>;
  }
  if (subPage === 'reset-password') {
    return <Suspense fallback={<PageLoader />}><ResetPassword onBack={handleBack} /></Suspense>;
  }
  if (subPage === 'complete-signup') {
    return <Suspense fallback={<PageLoader />}><CompleteSignup onBack={handleBack} onSuccess={() => setSubPage(null)} /></Suspense>;
  }

  // Admin pages - only accessible to admins and moderators
  // Note: Redirects are handled in useEffect above, this just renders the admin UI
  if (shouldShowAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        {subPage === 'verifications' && <Verifications />}
        {subPage === 'reports' && <Reports />}
        {subPage === 'users' && <Users />}
        {subPage === 'prices' && <Prices />}
        {subPage === 'contacts' && <Contacts />}
        {subPage === 'marketplace' && <AdminMarketplace />}
        {!subPage && <Dashboard />}
      </Suspense>
    );
  }

  // Render sub-page content - wrapped in Suspense for lazy loading
  // Task A: Removed setState calls during render - redirects now handled in useEffect above
  // Task C: Optimized sessionStorage access - only read when needed
  const renderSubPage = () => {
    if (!subPage) return null;

    // Cache sessionStorage reads per subPage
    const getStoredId = (key: string) => sessionStorage.getItem(key) || (selectedId ? selectedId.toString() : '');

    const content = (() => {
      switch (subPage) {
        case 'blog-detail': {
          const postId = getStoredId('blogDetailId');
          return postId ? <BlogDetail postId={postId} onBack={handleBack} /> : null;
        }
        case 'create-blog':
          return <CreateBlog />;
        case 'edit-blog': {
          const postId = getStoredId('blogEditId');
          return postId ? <EditBlog postId={postId} onBack={handleBack} /> : null;
        }
        case 'create-listing':
          return <CreateListing onBack={handleBack} />;
        case 'notice-detail': {
          const noticeId = getStoredId('noticeDetailId');
          return noticeId ? <NoticeDetail noticeId={noticeId} onBack={handleBack} /> : null;
        }
        case 'create-notice':
          return <CreateNotice onBack={handleBack} />;
        case 'job-detail': {
          const jobId = getStoredId('jobDetailId');
          return jobId ? <JobDetail jobId={jobId} onBack={handleBack} /> : null;
        }
        case 'create-job':
          return <CreateJob onBack={handleBack} />;
        case 'my-listings':
          return <MyListings />;
        case 'my-jobs':
          return <MyJobs />;
        case 'my-applications':
          return <MyApplications />;
        case 'certifications':
          return <Certifications />;
        case 'settings':
          return <Settings />;
        case 'about':
          return <AboutUs />;
        case 'contact':
          return <ContactUs />;
        case 'privacy':
          return <PrivacyPolicy />;
        case 'terms':
          return <TermsOfService />;
        default:
          return null;
      }
    })();
    
    return content ? <Suspense fallback={<PageLoader />}>{content}</Suspense> : null;
  };

  // Desktop Layout
  if (isDesktop) {
    // If sub-page exists, render it with sidebar
    if (subPage) {
      return (
        <div className="min-h-screen bg-[#F8F5F2] font-body text-[#2D241E] flex">
          <Sidebar onMenuOpen={() => setIsMenuOpen(true)} />
          <div className="flex-1 flex flex-col min-w-0">
            <DesktopHeader />
            <VerificationBanner />
            <main className="flex-1 overflow-y-auto">
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto">
                {renderSubPage()}
              </div>
            </main>
          </div>
          <CreateMenu 
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onSelect={handleMenuSelect}
          />
        </div>
      );
    }

    // Main pages with sidebar
    return (
      <div className="min-h-screen bg-[#F8F5F2] font-body text-[#2D241E] flex">
        <Sidebar onMenuOpen={() => setIsMenuOpen(true)} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <DesktopHeader />
          <VerificationBanner />
          
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto">
              <Suspense fallback={<PageLoader />}>
                {currentPage === 'home' && isAuthenticated && <Home onNavigate={(page) => {
                  setCurrentPage(page);
                }} />}
                {currentPage === 'market' && isAuthenticated && <Marketplace />}
                {currentPage === 'jobs' && isAuthenticated && <Jobs />}
                {currentPage === 'profile' && isAuthenticated && <Profile />}
                {currentPage === 'notices' && isAuthenticated && <Notices />}
                {currentPage === 'blog' && isAuthenticated && <BlogList />}
                {currentPage === 'prices' && isAuthenticated && <PriceBoard />}
                {currentPage === 'about' && <AboutUs />}
                {currentPage === 'contact' && <ContactUs />}
                {currentPage === 'privacy' && <PrivacyPolicy />}
                {currentPage === 'terms' && <TermsOfService />}
              </Suspense>
            </div>
          </main>
        </div>

        <CreateMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelect={handleMenuSelect}
        />
      </div>
    );
  }

  // Mobile Layout
  // If sub-page exists, render it (sub-pages have their own headers)
  if (subPage) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] font-body text-[#2D241E] max-w-2xl mx-auto shadow-2xl relative">
        {renderSubPage()}
        <CreateMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelect={handleMenuSelect}
        />
      </div>
    );
  }

  // Main mobile pages
  return (
    <div className="min-h-screen bg-[#F8F5F2] font-body text-[#2D241E] max-w-2xl mx-auto shadow-2xl relative">
      <Header />
      <VerificationBanner />
      
      <main className="min-h-screen">
        <div className="px-4 py-4 space-y-4">
          <Suspense fallback={<PageLoader />}>
            {currentPage === 'home' && isAuthenticated && <Home onNavigate={(page) => {
              setCurrentPage(page);
            }} />}
            {currentPage === 'market' && isAuthenticated && <Marketplace />}
            {currentPage === 'jobs' && isAuthenticated && <Jobs />}
            {currentPage === 'profile' && isAuthenticated && <Profile />}
            {currentPage === 'notices' && isAuthenticated && <Notices />}
            {currentPage === 'blog' && isAuthenticated && <BlogList />}
            {currentPage === 'prices' && isAuthenticated && <PriceBoard />}
            {currentPage === 'about' && <AboutUs />}
            {currentPage === 'contact' && <ContactUs />}
            {currentPage === 'privacy' && <PrivacyPolicy />}
            {currentPage === 'terms' && <TermsOfService />}
          </Suspense>
        </div>
      </main>

      <BottomNav 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onMenuOpen={() => setIsMenuOpen(true)}
      />

      <CreateMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelect={handleMenuSelect}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

