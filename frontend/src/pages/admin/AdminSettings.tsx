import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    newUserNotify: true,
    twoFactor: false,
    autoApprove: false,
    maintenanceMode: false,
  });

  const toggle = (k: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [k]: !s[k] }));

  const rows: { key: keyof typeof settings; label: string; description: string }[] = [
    { key: "emailAlerts", label: "Email Alerts", description: "Get notified about important platform events" },
    { key: "newUserNotify", label: "New User Notifications", description: "Email when a new user signs up" },
    { key: "twoFactor", label: "Two-Factor Authentication", description: "Require 2FA for admin accounts" },
    { key: "autoApprove", label: "Auto-Approve Reviews", description: "Publish user feedback without manual review" },
    { key: "maintenanceMode", label: "Maintenance Mode", description: "Take the site offline for maintenance" },
  ];

  return (
    <AdminLayout title="Settings" description="Configure platform behavior and preferences">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-3xl mb-6"
      >
        <h2 className="text-lg font-bold mb-4">Platform Preferences</h2>
        <div className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.key} className="flex items-center justify-between py-4 gap-4">
              <div>
                <p className="font-medium text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.description}</p>
              </div>
              <Switch checked={settings[r.key]} onCheckedChange={() => toggle(r.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-3xl"
      >
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Current Password</label>
            <Input type="password" />
          </div>
          <div />
          <div>
            <label className="text-sm font-medium mb-1 block">New Password</label>
            <Input type="password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Confirm Password</label>
            <Input type="password" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button>Update Password</Button>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
