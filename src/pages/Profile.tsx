import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, X, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from "@/components/SEO";
import { api, useAppDispatch, useAppSelector } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((s) => s.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/user/profile');
        if (!mounted) return;
        const u = data?.user || {};
        const next = {
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
        };
        setProfileData(next);
        setFormData(next);
      } catch (err: any) {
        toast({
          title: 'Failed to load profile',
          description: err?.response?.data?.message || err?.message || 'Please try again',
          variant: 'destructive',
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/user/profile', {
        name: formData.name,
        phone: formData.phone,
      });
      const u = data?.user || {};
      const next = {
        name: u.name || formData.name,
        email: u.email || formData.email,
        phone: u.phone || '',
      };
      setProfileData(next);
      setFormData(next);

      // Keep Redux + localStorage user in sync
      try {
        const merged = { ...(reduxUser || {}), ...u };
        localStorage.setItem('user', JSON.stringify(merged));
        dispatch({ type: 'auth/refresh/fulfilled', payload: { user: merged } });
      } catch {}

      toast({ title: 'Profile updated', description: data?.message || 'Your changes have been saved.' });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err?.response?.data?.message || err?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      <SEO title="My Profile" description="Manage your WindowsUtils profile and account information." path="/profile" keywords="profile, account info" type="website" noIndex />
      <Navbar />

      {/* Header */}
      <section className="bg-hero text-hero-foreground py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-hero-muted">Manage your account information</p>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profileData.name}</h2>
                    <p className="text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/5 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading profile...
                </div>
              )}

              {!loading && (
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;