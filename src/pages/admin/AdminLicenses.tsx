import { motion } from "framer-motion";
import { Key, CheckCircle, Clock, XCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface License {
  id: number;
  key: string;
  user: string;
  software: string;
  systems: string;
  purchase: string;
  expiry: string;
  status: "active" | "trial" | "expired";
}

const licenses: License[] = [
  { id: 1, key: "WCP-9F4A-2B7E-6C1D", user: "Rohit Sharma", software: "Windows Cleaner Pro", systems: "1/2", purchase: "2026-01-15", expiry: "2027-01-15", status: "active" },
  { id: 2, key: "PWM-3K8L-9D2F-1A5G", user: "Anita Verma", software: "Password Manager", systems: "2/3", purchase: "2026-02-10", expiry: "2027-02-10", status: "active" },
  { id: 3, key: "DRT-7H2P-4M9N-6Q3R", user: "Karan Mehta", software: "Data Recovery", systems: "0/1", purchase: "2026-03-05", expiry: "2026-04-05", status: "trial" },
  { id: 4, key: "SOP-5J1K-8L4M-2N7P", user: "Sneha Iyer", software: "System Optimizer", systems: "1/1", purchase: "2025-04-20", expiry: "2026-04-20", status: "expired" },
  { id: 5, key: "MBX-2026-50PC-PDFC-9X7Q", user: "Rohit Sharma", software: "MBOX to PDF Converter", systems: "0/50", purchase: "2026-05-01", expiry: "2027-05-01", status: "active" },
];

const stats = [
  { label: "Total", value: licenses.length, icon: Key, color: "primary" },
  { label: "Active", value: licenses.filter((l) => l.status === "active").length, icon: CheckCircle, color: "success" },
  { label: "Trial", value: licenses.filter((l) => l.status === "trial").length, icon: Clock, color: "accent" },
  { label: "Expired", value: licenses.filter((l) => l.status === "expired").length, icon: XCircle, color: "destructive" },
];

const badge = (s: License["status"]) => {
  const map = {
    active: "bg-success/10 text-success",
    trial: "bg-accent/10 text-accent",
    expired: "bg-destructive/10 text-destructive",
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${map[s]}`}>{s}</span>;
};

export default function AdminLicenses() {
  return (
    <AdminLayout title="Licenses" description="All license keys issued across the platform">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg bg-${s.color}/10 flex items-center justify-center`}>
                <s.icon className={`h-4 w-4 text-${s.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
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
                <TableHead>License Key</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Software</TableHead>
                <TableHead>Systems</TableHead>
                <TableHead>Purchase</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs">{l.key}</TableCell>
                  <TableCell className="text-sm">{l.user}</TableCell>
                  <TableCell className="text-sm">{l.software}</TableCell>
                  <TableCell>{l.systems}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.purchase}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.expiry}</TableCell>
                  <TableCell>{badge(l.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Revoke</Button>
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
