import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, useAppDispatch, useAppSelector } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

interface AdminProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string | null;
}

export default function AdminProfile() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfileData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: null,
  });
  const [form, setForm] = useState<AdminProfileData>(profile);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/user/profile");
        if (!mounted) return;
        const u = data?.user || {};
        const next: AdminProfileData = {
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          role: u.role || reduxUser?.role || "admin",
          avatar: u.avatar || null,
        };
        setProfile(next);
        setForm(next);
      } catch (err: any) {
        toast({
          title: "Failed to load profile",
          description: err?.response?.data?.message || err?.message || "Please try again",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (field: keyof AdminProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCancel = () => setForm(profile);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/user/profile", {
        name: form.name,
        phone: form.phone,
      });
      const u = data?.user || {};
      const next: AdminProfileData = {
        name: u.name || form.name,
        email: u.email || form.email,
        phone: u.phone || "",
        role: u.role || profile.role,
        avatar: u.avatar || profile.avatar,
      };
      setProfile(next);
      setForm(next);

      try {
        const merged = { ...(reduxUser || {}), ...u };
        localStorage.setItem("user", JSON.stringify(merged));
        dispatch({ type: "auth/refresh/fulfilled", payload: { user: merged } });
      } catch {}

      toast({ title: "Profile updated", description: data?.message || "Your changes have been saved." });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = profile.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Admin";

  return (
    <AdminLayout title="Profile" description="Manage your administrator profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading profile...
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.name || "Admin User"}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <span className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input value={form.name} onChange={onChange("name")} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input value={form.email} type="email" disabled />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input value={form.phone} onChange={onChange("phone")} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Role</label>
                <Input value={roleLabel} disabled />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
}
