import { motion } from "framer-motion";
import { User } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminProfile() {
  return (
    <AdminLayout title="Profile" description="Manage your administrator profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin User</h2>
            <p className="text-sm text-muted-foreground">admin@example.com</p>
            <span className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              Super Admin
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <Input defaultValue="Admin User" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input defaultValue="admin@example.com" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Phone</label>
            <Input defaultValue="+91 98765 43210" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <Input defaultValue="Super Admin" disabled />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
