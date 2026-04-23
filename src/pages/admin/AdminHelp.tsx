import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";

interface Article {
  id: number;
  title: string;
  category: string;
  views: number;
  updated: string;
}

const articles: Article[] = [
  { id: 1, title: "How to install on Windows 11", category: "Installation", views: 1284, updated: "2026-04-15" },
  { id: 2, title: "Activating your license key", category: "Licensing", views: 982, updated: "2026-04-12" },
  { id: 3, title: "Transferring license to a new PC", category: "Licensing", views: 654, updated: "2026-04-10" },
  { id: 4, title: "Refund policy explained", category: "Billing", views: 421, updated: "2026-04-05" },
  { id: 5, title: "Troubleshooting common errors", category: "Support", views: 1567, updated: "2026-04-02" },
];

export default function AdminHelp() {
  const [items] = useState(articles);

  return (
    <AdminLayout title="Help Center" description="Manage knowledge base articles">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Articles ({items.length})</h2>
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Article</Button>
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
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </AdminLayout>
  );
}
