import { ArrowLeft, Shield, User, Info, MessageCircle, FileText, LogOut } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { useState, useEffect } from 'react';
import { t } from '@/i18n';

export const Settings = () => {
  const { setCurrentPage, setSubPage, language, setLanguage, setUserRole, navigate } = useApp();
  const { user, updateUser, logout: authLogout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Check if user can edit name (only before verification, except mods/admins)
  const isModOrAdmin = user?.role === 'admin' || user?.role === 'moderator';
  const canEditName = !user?.verified || isModOrAdmin;

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-32">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#EBE3D5] px-6 py-4 flex items-center gap-4">
        <button onClick={() => setSubPage(null)} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-black text-[#6F4E37] flex-1">{t(language, 'settings.title')}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Information */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <User size={20} className="text-[#6F4E37]" />
            {t(language, 'settings.profileInformation')}
          </h3>
          <div className="space-y-4">
            <Input
              label={t(language, 'settings.fullName')}
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!canEditName}
            />
            {!canEditName && (
              <p className="text-xs text-gray-500 mt-1">
                Name can only be updated before verification. Please contact support if you need to change your name after verification.
              </p>
            )}
            <Input
              type="email"
              label={t(language, 'settings.email')}
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            <Input
              type="tel"
              label={t(language, 'settings.phoneNumber')}
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
            <Input
              label={t(language, 'settings.location')}
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            />
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
            <Button 
              variant="primary" 
              className="w-full"
              disabled={saving}
              onClick={async () => {
                if (!user) return;
                
                setSaving(true);
                setError(null);
                setSuccess(null);
                
                try {
                  // Only send name if it can be edited
                  const updateData: any = {
                    phone: profileData.phone,
                    location: profileData.location
                  };
                  
                  if (canEditName) {
                    updateData.name = profileData.name;
                  }
                  
                  const result = await authService.updateProfile(updateData);
                  
                  if (result.user) {
                    updateUser(result.user);
                    setSuccess(t(language, 'settings.profileUpdated') || 'Profile updated successfully');
                    setTimeout(() => setSuccess(null), 3000);
                  }
                } catch (err: any) {
                  console.error('Failed to update profile:', err);
                  setError(err.message || 'Failed to update profile. Please try again.');
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? 'Saving...' : t(language, 'settings.saveChanges')}
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <User size={20} className="text-[#6F4E37]" />
            {t(language, 'settings.preferences')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
                {t(language, 'settings.language')}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ne')}
                className="w-full bg-white border border-[#EBE3D5] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[#6F4E37]/10 text-sm"
              >
                <option value="en">{t(language, 'settings.languageEnglish')}</option>
                <option value="ne">{t(language, 'settings.languageNepali')}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* About & Contact */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <Info size={20} className="text-[#6F4E37]" />
            {t(language, 'settings.information')}
          </h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('about');
                setSubPage(null);
              }}
            >
              <Info size={16} /> {t(language, 'nav.about')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('contact');
                setSubPage(null);
              }}
            >
              <MessageCircle size={16} /> {t(language, 'nav.contact')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('faq');
                setSubPage(null);
              }}
            >
              <Info size={16} /> {t(language, 'nav.faq')}
            </Button>
          </div>
        </Card>

        {/* Legal */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <Shield size={20} className="text-[#6F4E37]" />
            {t(language, 'settings.legal')}
          </h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('privacy');
                setSubPage(null);
              }}
            >
              <Shield size={16} /> {t(language, 'nav.privacy')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('terms');
                setSubPage(null);
              }}
            >
              <FileText size={16} /> {t(language, 'nav.terms')}
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="p-6">
          <Button
            variant="outline"
            className="w-full py-4 text-red-600 border-red-200 bg-red-50/20 hover:bg-red-100"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={18} /> Log Out
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmText="Log Out"
        cancelText="Cancel"
        variant="danger"
        onConfirm={async () => {
          await authLogout();
          setUserRole('farmer');
          setCurrentPage('home');
          navigate('login');
          setShowLogoutConfirm(false);
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

