import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Ban, CheckCircle, UserPlus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  joined: string;
  licenses: number;
}

const allUsers: User[] = [
  { id: 1, name: "Rohit Sharma", email: "rohit@example.com", role: "user", status: "active", joined: "2026-01-12", licenses: 2 },
  { id: 2, name: "Anita Verma", email: "anita.v@example.com", role: "user", status: "active", joined: "2026-02-04", licenses: 1 },
  { id: 3, name: "Karan Mehta", email: "karan.m@example.com", role: "admin", status: "active", joined: "2025-11-18", licenses: 5 },
  { id: 4, name: "Sneha Iyer", email: "sneha.i@example.com", role: "user", status: "suspended", joined: "2026-03-08", licenses: 0 },
  { id: 5, name: "Amit Patel", email: "amit.p@example.com", role: "user", status: "active", joined: "2026-03-22", licenses: 3 },
  { id: 6, name: "Priya Nair", email: "priya.n@example.com", role: "user", status: "active", joined: "2026-04-01", licenses: 1 },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <AdminLayout title="Users" description="Manage all registered users and their access">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
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

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Licenses</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell>{u.licenses}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${u.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {u.status === "active" ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Mail className="h-4 w-4" />
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
