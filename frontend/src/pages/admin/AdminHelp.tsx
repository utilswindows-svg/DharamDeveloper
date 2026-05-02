import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface Article {
  id: number;
  title: string;
  category: string;
  views: number;
  updated: string;
  content?: string;
}

const seed: Article[] = [
  { id: 1, title: "How to install on Windows 11", category: "Installation", views: 1284, updated: "2026-04-15", content: "Step-by-step guide to install our software on Windows 11." },
  { id: 2, title: "Activating your license key", category: "Licensing", views: 982, updated: "2026-04-12", content: "Open the app, go to Help > Activate, paste your key and click Activate." },
  { id: 3, title: "Transferring license to a new PC", category: "Licensing", views: 654, updated: "2026-04-10", content: "Deactivate on old PC first, then activate on the new one using the same key." },
  { id: 4, title: "Refund policy explained", category: "Billing", views: 421, updated: "2026-04-05", content: "We offer a 30-day money-back guarantee on all products." },
  { id: 5, title: "Troubleshooting common errors", category: "Support", views: 1567, updated: "2026-04-02", content: "Restart the app, check logs in %APPDATA%, and contact support if needed." },
];

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminHelp() {
  const [items, setItems] = useState<Article[]>(seed);
  const [editing, setEditing] = useState<Article | null>(null);
  const [viewing, setViewing] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState<Article | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Installation", content: "" });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", category: "Installation", content: "" });
    setOpen(true);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ title: a.title, category: a.category, content: a.content || "" });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.category.trim()) {
      toast({ title: "Missing fields", description: "Title and category are required." });
      return;
    }
    if (editing) {
      setItems((prev) =>
        prev.map((a) =>
          a.id === editing.id ? { ...a, ...form, updated: today() } : a
        )
      );
      toast({ title: "Article updated", description: form.title });
    } else {
      const id = Math.max(0, ...items.map((i) => i.id)) + 1;
      setItems((prev) => [
        { id, ...form, views: 0, updated: today() },
        ...prev,
      ]);
      toast({ title: "Article created", description: form.title });
    }
    setOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setItems((prev) => prev.filter((a) => a.id !== deleting.id));
    toast({ title: "Article deleted", description: deleting.title });
    setDeleting(null);
  };

  return (
    <AdminLayout title="Help Center" description="Manage knowledge base articles">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Articles ({items.length})</h2>
          <Button className="gap-2" onClick={openNew}>
            <Plus className="h-4 w-4" /> New Article
          </Button>
        </div>
        <ul className="divide-y divide-border">
          {items.map((a) => (
            <li key={a.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.category} · {a.views.toLocaleString()} views · Updated {a.updated}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setViewing(a)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleting(a)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">No articles yet.</li>
          )}
        </ul>
      </motion.div>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the article details." : "Add a new knowledge base article."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Installation, Licensing, Billing"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Content</label>
              <Textarea
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write the article content..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>
              {viewing?.category} · {viewing?.views.toLocaleString()} views · Updated {viewing?.updated}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {viewing?.content || "No content available."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            <Button
              onClick={() => {
                if (viewing) openEdit(viewing);
                setViewing(null);
              }}
            >
              <Edit className="h-4 w-4" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete article?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
