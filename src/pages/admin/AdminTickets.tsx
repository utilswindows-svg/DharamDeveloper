import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  email: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  created: string;
}

const tickets: SupportTicket[] = [
  { id: "T-1284", subject: "Installation fails on Windows 11", user: "Rohit Sharma", email: "rohit@example.com", priority: "high", status: "open", created: "2026-04-22" },
  { id: "T-1283", subject: "License key not activating", user: "Anita Verma", email: "anita.v@example.com", priority: "high", status: "in_progress", created: "2026-04-22" },
  { id: "T-1282", subject: "Feature request: dark mode", user: "Karan Mehta", email: "karan.m@example.com", priority: "low", status: "open", created: "2026-04-21" },
  { id: "T-1281", subject: "Refund request", user: "Sneha Iyer", email: "sneha.i@example.com", priority: "medium", status: "resolved", created: "2026-04-20" },
  { id: "T-1280", subject: "How to transfer license to new PC", user: "Amit Patel", email: "amit.p@example.com", priority: "medium", status: "resolved", created: "2026-04-19" },
];

const priorityColor = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-accent/10 text-accent",
  high: "bg-destructive/10 text-destructive",
};

const statusBadge = (s: SupportTicket["status"]) => {
  const map = {
    open: { cls: "bg-destructive/10 text-destructive", icon: AlertCircle, label: "Open" },
    in_progress: { cls: "bg-accent/10 text-accent", icon: Clock, label: "In Progress" },
    resolved: { cls: "bg-success/10 text-success", icon: CheckCircle, label: "Resolved" },
  };
  const cfg = map[s];
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${cfg.cls}`}>
      <cfg.icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
};

export default function AdminTickets() {
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <AdminLayout title="Support Tickets" description="Manage customer support requests">
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f.replace("_", " ")}
          </Button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium text-sm flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-accent" /> {t.subject}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{t.user}</p>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${priorityColor[t.priority]}`}>
                      {t.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.created}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
