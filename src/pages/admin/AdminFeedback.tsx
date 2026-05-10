import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Pencil, Trash2, Search, Loader2, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { api } from "@/store/authStore";

type Status = "new" | "read" | "archived";

interface Feedback {
  id: number;
  userId: number | null;
  name: string;
  email: string;
  message: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const statusBadge = (s: Status) => {
  const map: Record<Status, string> = {
    new: "bg-accent/10 text-accent",
    read: "bg-success/10 text-success",
    archived: "bg-muted text-muted-foreground",
  };
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${map[s]}`}>{s}</span>;
};

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Feedback | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "", status: "new" as Status });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/feedback");
      setFeedbacks(data?.feedback || []);
    } catch (err: any) {
      toast({
        title: "Failed to load feedback",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return feedbacks.filter((f) => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (!q) return true;
      return [f.name, f.email, f.message].some((v) => v?.toLowerCase().includes(q));
    });
  }, [feedbacks, search, statusFilter]);

  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter((f) => f.status === "new").length,
    read: feedbacks.filter((f) => f.status === "read").length,
    archived: feedbacks.filter((f) => f.status === "archived").length,
  };

  const openEdit = (f: Feedback) => {
    setEditing(f);
    setForm({ name: f.name, email: f.email, message: f.message, status: f.status });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/feedback/${editing.id}`, form);
      toast({ title: "Feedback updated" });
      setOpen(false);
      await load();
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

  const handleStatusChange = async (f: Feedback, status: Status) => {
    try {
      await api.patch(`/feedback/${f.id}`, { status });
      setFeedbacks((prev) => prev.map((x) => (x.id === f.id ? { ...x, status } : x)));
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this feedback? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Feedback deleted" });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Feedback" description="All user feedback submitted across the platform">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "primary" },
          { label: "New", value: stats.new, color: "accent" },
          { label: "Read", value: stats.read, color: "success" },
          { label: "Archived", value: stats.archived, color: "muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-bold text-${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground ml-auto">
            Showing {filtered.length} of {feedbacks.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading feedback...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
          No feedback found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
              className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {f.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {f.email}
                    </p>
                  </div>
                </div>
                {statusBadge(f.status)}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Submitted {fmtDate(f.createdAt)}
              </p>
              <p className="text-sm text-foreground flex gap-2 flex-1">
                <MessageSquare className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                {f.message}
              </p>
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border">
                <Select value={f.status} onValueChange={(v) => handleStatusChange(f, v as Status)}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(f)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deletingId === f.id}
                    onClick={() => handleDelete(f.id)}
                  >
                    {deletingId === f.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
