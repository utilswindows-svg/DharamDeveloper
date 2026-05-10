import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileDown, HardDrive, Search, Users, Download, TrendingUp, Filter, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface DownloadRecord {
  id: number;
  user: string;
  email: string;
  fileName: string;
  product: string;
  productSlug?: string;
  version?: string;
  date: string;
  time: string;
  size: string;
  device: string;
  ip: string;
  type: 'free' | 'licensed';
  createdAt: string;
}

const AdminDownloads = () => {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [allDownloads, setAllDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/user/admin/downloads');
        if (!mounted) return;
        const rows: DownloadRecord[] = (data?.downloads || []).map((d: any) => {
          const dt = d.createdAt ? new Date(d.createdAt) : new Date();
          return {
            id: d.id,
            user: d.user || 'Unknown',
            email: d.email || '',
            fileName: d.fileName || '',
            product: d.product || '',
            productSlug: d.productSlug,
            version: d.version,
            date: dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            size: d.size || '—',
            device: d.device || 'Unknown',
            ip: d.ip || '—',
            type: (d.type === 'licensed' ? 'licensed' : 'free') as 'free' | 'licensed',
            createdAt: d.createdAt,
          };
        });
        setAllDownloads(rows);
      } catch (err: any) {
        toast({
          title: 'Failed to load downloads',
          description: err?.response?.data?.message || err?.message || 'Please try again',
          variant: 'destructive',
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const products = useMemo(
    () => Array.from(new Set(allDownloads.map((d) => d.product))),
    [allDownloads]
  );

  const filtered = useMemo(() => {
    return allDownloads.filter((d) => {
      const matchesSearch =
        !search ||
        d.user.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.fileName.toLowerCase().includes(search.toLowerCase());
      const matchesProduct = productFilter === 'all' || d.product === productFilter;
      const matchesType = typeFilter === 'all' || d.type === typeFilter;
      return matchesSearch && matchesProduct && matchesType;
    });
  }, [search, productFilter, typeFilter, allDownloads]);

  const totalDownloads = allDownloads.length;
  const freeDownloads = allDownloads.filter((d) => d.type === 'free').length;
  const uniqueUsers = new Set(allDownloads.map((d) => d.email)).size;
  const todayStr = new Date().toDateString();
  const todayDownloads = allDownloads.filter(
    (d) => d.createdAt && new Date(d.createdAt).toDateString() === todayStr,
  ).length;

  const exportCsv = () => {
    const headers = ['Date', 'Time', 'User', 'Email', 'File Name', 'Product', 'Size', 'Device', 'IP', 'Type'];
    const rows = filtered.map((d) => [d.date, d.time, d.user, d.email, d.fileName, d.product, d.size, d.device, d.ip, d.type]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `download-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Downloads', value: totalDownloads, icon: Download, color: 'accent' },
    { label: 'Free Downloads', value: freeDownloads, icon: FileDown, color: 'success' },
    { label: 'Unique Users', value: uniqueUsers, icon: Users, color: 'accent' },
    { label: "Today's Downloads", value: todayDownloads, icon: TrendingUp, color: 'success' },
  ];

  return (
    <AdminLayout
      title="Download History"
      description="Complete log of every free and licensed .exe download across all users"
    >
          {loading && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading downloads...
            </div>
          )}

          {!loading && (
          <>
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-card rounded-xl shadow-lg p-6 border border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-${stat.color}/10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 text-${stat.color}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Filters & Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-xl shadow-lg p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold">All Downloads</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {filtered.length} of {totalDownloads} records
                </p>
              </div>
              <Button onClick={exportCsv} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-3 mb-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search user, email, or file name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All products" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="licensed">Licensed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date / Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Device / IP</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No downloads match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-accent" />
                            <div>
                              <p className="font-medium text-sm">{item.date}</p>
                              <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{item.user}</p>
                            <p className="text-xs text-muted-foreground">{item.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileDown className="h-4 w-4 text-success" />
                            <span className="font-mono text-xs">{item.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.product}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <HardDrive className="h-4 w-4" />
                            <div>
                              <p className="text-xs">{item.device}</p>
                              <p className="font-mono text-xs">{item.ip}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              item.type === 'free'
                                ? 'bg-success/10 text-success'
                                : 'bg-accent/10 text-accent'
                            }`}
                          >
                            {item.type}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
          </>
          )}
    </AdminLayout>
  );
};

export default AdminDownloads;