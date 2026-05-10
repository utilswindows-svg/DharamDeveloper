import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, EyeOff, Save, Loader2, ShieldCheck, X, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from "@/components/SEO";
import { api } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
    twoFactor: false,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA email-OTP flow
  const [twoFaModal, setTwoFaModal] = useState<{ open: boolean; action: 'enable' | 'disable' }>({ open: false, action: 'enable' });
  const [twoFaOtp, setTwoFaOtp] = useState('');
  const [twoFaSending, setTwoFaSending] = useState(false);
  const [twoFaVerifying, setTwoFaVerifying] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/user/settings');
        if (mounted && data?.settings) setSettings((s) => ({ ...s, ...data.settings }));
      } catch (err: any) {
        toast({ title: 'Failed to load settings', description: err?.response?.data?.message || err.message, variant: 'destructive' });
      } finally {
        if (mounted) setLoadingSettings(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  const handleSettingChange = async (key: keyof typeof settings) => {
    if (key === 'twoFactor') {
      // 2FA goes through email OTP — open modal and request code
      const action: 'enable' | 'disable' = settings.twoFactor ? 'disable' : 'enable';
      await requestTwoFaOtp(action);
      return;
    }
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    try {
      await api.put('/user/settings', { [key]: next[key] });
    } catch (err: any) {
      // revert on failure
      setSettings((s) => ({ ...s, [key]: !next[key] }));
      toast({ title: 'Update failed', description: err?.response?.data?.message || err.message, variant: 'destructive' });
    }
  };

  const requestTwoFaOtp = async (action: 'enable' | 'disable') => {
    setTwoFaSending(true);
    try {
      const { data } = await api.post('/user/2fa/request-otp', { enable: action === 'enable' });
      toast({ title: 'Code sent', description: data?.message || `Verification code sent` });
      setTwoFaOtp('');
      setTwoFaModal({ open: true, action });
    } catch (err: any) {
      toast({ title: 'Failed to send code', description: err?.response?.data?.message || err.message, variant: 'destructive' });
    } finally {
      setTwoFaSending(false);
    }
  };

  const handleVerifyTwoFa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaOtp.trim()) {
      toast({ title: 'Enter code', description: 'Please enter the verification code from your email', variant: 'destructive' });
      return;
    }
    setTwoFaVerifying(true);
    try {
      const { data } = await api.post('/user/2fa/verify', { otp: twoFaOtp.trim() });
      setSettings((s) => ({ ...s, twoFactor: !!data?.twoFactor }));
      toast({ title: 'Success', description: data?.message || 'Two-factor authentication updated' });
      setTwoFaModal({ open: false, action: twoFaModal.action });
      setTwoFaOtp('');
    } catch (err: any) {
      toast({ title: 'Verification failed', description: err?.response?.data?.message || err.message, variant: 'destructive' });
    } finally {
      setTwoFaVerifying(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword) {
      toast({ title: 'Missing fields', description: 'Enter current and new password', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'Weak password', description: 'New password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Mismatch', description: 'New password and confirmation do not match', variant: 'destructive' });
      return;
    }
    setUpdatingPassword(true);
    try {
      const { data } = await api.post('/user/change-password', { currentPassword, newPassword });
      toast({ title: 'Success', description: data?.message || 'Password updated' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.response?.data?.message || err.message, variant: 'destructive' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      // Exclude twoFactor — managed via OTP flow
      const { twoFactor, ...rest } = settings;
      await api.put('/user/settings', rest);
      toast({ title: 'Saved', description: 'All preferences updated' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.response?.data?.message || err.message, variant: 'destructive' });
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO title="Account Settings" description="Manage your WindowsUtils account settings and security preferences." path="/settings" keywords="settings, preferences, security" type="website" noIndex />
      <Navbar />

      {/* Header */}
      <section className="bg-hero text-hero-foreground py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
            <p className="text-hero-muted">Manage your preferences and security</p>
          </motion.div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-12">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Notifications</h2>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive SMS updates for important events' },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional offers and news' },
                  { key: 'securityAlerts', label: 'Security Alerts', desc: 'Get notified about suspicious activity' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof typeof settings]}
                        onChange={() => handleSettingChange(item.key as keyof typeof settings)}
                        disabled={loadingSettings}
                        className="w-5 h-5 rounded accent-accent"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Security</h2>
              </div>

              {/* Two-Factor Authentication */}
              <div className="mb-6 p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactor}
                      onChange={() => handleSettingChange('twoFactor')}
                      disabled={loadingSettings}
                      className="w-5 h-5 rounded accent-accent"
                    />
                  </label>
                </div>
              </div>

              {/* Change Password */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all font-medium"
                  >
                    {updatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-end"
            >
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-all font-medium"
              >
                {savingSettings ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {savingSettings ? 'Saving...' : 'Save All Changes'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Settings;