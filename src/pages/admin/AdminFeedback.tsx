import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Feedback {
  id: number;
  user: string;
  email: string;
  product: string;
  rating: number;
  message: string;
  date: string;
}

const initial: Feedback[] = [
  { id: 1, user: "Rohit Sharma", email: "rohit@example.com", product: "Windows Cleaner Pro", rating: 5, message: "Excellent product! Cleaned up 12GB of junk files. Highly recommended.", date: "2026-04-22" },
  { id: 2, user: "Anita Verma", email: "anita.v@example.com", product: "Password Manager", rating: 4, message: "Works great, but I'd love a browser extension for Firefox.", date: "2026-04-21" },
  { id: 3, user: "Karan Mehta", email: "karan.m@example.com", product: "System Optimizer", rating: 5, message: "Boot time improved by 40%. Worth every rupee.", date: "2026-04-20" },
  { id: 4, user: "Sneha Iyer", email: "sneha.i@example.com", product: "Data Recovery", rating: 3, message: "Recovered most files but not the ones I needed most. Mixed feelings.", date: "2026-04-18" },
];

const Stars = ({ n, onChange }: { n: number; onChange?: (v: number) => void }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange?.(i)}
        disabled={!onChange}
        className={onChange ? "cursor-pointer" : "cursor-default"}
      >
        <Star className={`h-4 w-4 ${i <= n ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />
      </button>
    ))}
  </div>
);

const emptyForm = { user: "", email: "", product: "", rating: 5, message: "" };

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Feedback | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (f: Feedback) => {
    setEditing(f);
    setForm({ user: f.user, email: f.email, product: f.product, rating: f.rating, message: f.message });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.user.trim() || !form.email.trim() || !form.product.trim() || !form.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    if (editing) {
      setFeedbacks((prev) => prev.map((f) => (f.id === editing.id ? { ...f, ...form } : f)));
      toast({ title: "Feedback updated" });
    } else {
      const newF: Feedback = {
        id: Math.max(0, ...feedbacks.map((f) => f.id)) + 1,
        ...form,
        date: new Date().toISOString().slice(0, 10),
      };
      setFeedbacks((prev) => [newF, ...prev]);
      toast({ title: "Feedback added" });
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    toast({ title: "Feedback deleted" });
  };

  return (
    <AdminLayout title="Feedback" description="User reviews and product feedback">
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Feedback
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {feedbacks.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {f.user.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.user}</p>
                  <p className="text-xs text-muted-foreground">{f.email}</p>
                </div>
              </div>
              <Stars n={f.rating} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">{f.product}</span> · {f.date}
            </p>
            <p className="text-sm text-foreground flex gap-2">
              <MessageSquare className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              {f.message}
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
              <Button size="sm" variant="outline" onClick={() => openEdit(f)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(f.id)}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user">User Name</Label>
              <Input id="user" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Input id="product" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Rating</Label>
              <Stars n={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Feedback"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
