import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, CheckCircle, UserPlus, Download, ShoppingBag, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin";
  provider?: string;
  status: "active" | "suspended";
  joined: string;
  downloads: number;
  lastDownloadAt?: string | null;
  purchases: number;
  totalSpent: number;
  lastPurchaseAt?: string | null;
  licenses: number;
}

const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return "—"; }
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/user/admin/users");
        if (!mounted) return;
        setUsers(data?.users || []);
      } catch (err: any) {
        toast({
          title: "Failed to load users",
          description: err?.response?.data?.message || err?.message || "Please try again",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, users],
  );

  const totalDownloads = users.reduce((acc, u) => acc + (u.downloads || 0), 0);
  const totalPurchases = users.reduce((acc, u) => acc + (u.purchases || 0), 0);
  const totalSpent = users.reduce((acc, u) => acc + (Number(u.totalSpent) || 0), 0);

  return (
    <AdminLayout title="Users" description="Manage all registered users with their downloads and purchases">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold mt-1">{users.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Total Downloads</p>
            <p className="text-2xl font-bold mt-1">{totalDownloads}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Total Purchases</p>
            <p className="text-2xl font-bold mt-1">
              {totalPurchases}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (${totalSpent.toFixed(2)})
              </span>
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Add User
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading users...
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Downloads</TableHead>
                    <TableHead className="text-center">Purchases</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              u.role === "admin"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <Download className="h-3.5 w-3.5 text-success" />
                            <span className="font-medium">{u.downloads}</span>
                          </div>
                          {u.lastDownloadAt && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Last: {fmtDate(u.lastDownloadAt)}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <ShoppingBag className="h-3.5 w-3.5 text-accent" />
                            <span className="font-medium">{u.purchases}</span>
                          </div>
                          {u.lastPurchaseAt && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Last: {fmtDate(u.lastPurchaseAt)}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          ${Number(u.totalSpent || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmtDate(u.joined)}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3" />
                            {u.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <a href={`mailto:${u.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
