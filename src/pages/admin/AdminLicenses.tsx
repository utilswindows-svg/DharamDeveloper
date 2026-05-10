import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Key, CheckCircle, Clock, XCircle, Search, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

interface License {
  id: number;
  key: string;
  user: string;
  email: string;
  software: string;
  licenseName: string;
  seats: number;
  systems: string;
  purchase: string;
  expiry: string | null;
  total: number;
  currency: string;
  status: "active" | "trial" | "expired";
}

const badge = (s: License["status"]) => {
  const map = {
    active: "bg-success/10 text-success",
    trial: "bg-accent/10 text-accent",
    expired: "bg-destructive/10 text-destructive",
  } as const;
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${map[s]}`}>{s}</span>;
};

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export default function AdminLicenses() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/user/admin/licenses");
      setLicenses(data?.licenses || []);
    } catch (err: any) {
      toast({
        title: "Failed to load licenses",
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
    if (!q) return licenses;
    return licenses.filter((l) =>
      [l.key, l.user, l.email, l.software, l.licenseName].some((v) => v?.toLowerCase().includes(q))
    );
  }, [licenses, search]);

  const stats = [
    { label: "Total", value: licenses.length, icon: Key, color: "primary" },
    { label: "Active", value: licenses.filter((l) => l.status === "active").length, icon: CheckCircle, color: "success" },
    { label: "Trial", value: licenses.filter((l) => l.status === "trial").length, icon: Clock, color: "accent" },
    { label: "Expired", value: licenses.filter((l) => l.status === "expired").length, icon: XCircle, color: "destructive" },
  ];

  const revoke = async (id: number) => {
    if (!confirm("Revoke this license? The order will be marked refunded and expired.")) return;
    setRevokingId(id);
    try {
      await api.post(`/user/admin/licenses/${id}/revoke`);
      toast({ title: "License revoked" });
      await load();
    } catch (err: any) {
      toast({
        title: "Revoke failed",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setRevokingId(null);
    }
  };

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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold">All Licenses</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} of {licenses.length}
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search key, user, software..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading licenses...
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>License Key</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Software</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Purchase</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      No licenses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-mono text-xs">{l.key}</TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{l.user}</div>
                        <div className="text-xs text-muted-foreground">{l.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">{l.software}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.licenseName}</TableCell>
                      <TableCell>{l.systems}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDate(l.purchase)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDate(l.expiry)}</TableCell>
                      <TableCell>{badge(l.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={l.status === "expired" || revokingId === l.id}
                          onClick={() => revoke(l.id)}
                        >
                          {revokingId === l.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Revoke"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
