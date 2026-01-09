import { ArrowLeft, Bell, Moon, Shield, Trash2, User, Info, MessageCircle, FileText } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { t } from '@/i18n';

export const Settings = () => {
  const { setCurrentPage, setSubPage, language, setLanguage } = useApp();
  const { user, updateUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
            />
            <Input
              type="email"
              label={t(language, 'settings.email')}
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
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
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => {
                // Update user in context and localStorage
                if (user) {
                  updateUser({
                    name: profileData.name,
                    email: profileData.email,
                    phone: profileData.phone,
                    location: profileData.location
                  });
                  // Also update localStorage
                  const updatedUser = { ...user, ...profileData };
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                  alert(t(language, 'settings.profileUpdated'));
                }
              }}
            >
              {t(language, 'settings.saveChanges')}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <Bell size={20} className="text-[#6F4E37]" />
            {t(language, 'settings.notifications')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-sm">{t(language, 'settings.pushNotifications')}</p>
                <p className="text-xs text-gray-500">{t(language, 'settings.pushNotificationsDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6F4E37]"></div>
              </label>
            </div>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>{t(language, 'settings.newMessages')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>{t(language, 'settings.jobOpportunities')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>{t(language, 'settings.priceAlerts')}</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>{t(language, 'settings.marketingEmails')}</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <Moon size={20} className="text-[#6F4E37]" />
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-sm">{t(language, 'settings.darkMode')}</p>
                <p className="text-xs text-gray-500">{t(language, 'settings.darkModeDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6F4E37]"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <Shield size={20} className="text-[#6F4E37]" />
            {t(language, 'settings.privacySecurity')}
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              {t(language, 'settings.changePassword')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t(language, 'settings.twoFactorAuth')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t(language, 'settings.privacySettings')}
            </Button>
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

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <h3 className="font-black text-lg mb-4 text-red-600 flex items-center gap-2">
            <Trash2 size={20} />
            {t(language, 'settings.dangerZone')}
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200">
              {t(language, 'settings.deleteAccount')}
            </Button>
            <p className="text-xs text-gray-500">{t(language, 'settings.deleteAccountWarning')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

