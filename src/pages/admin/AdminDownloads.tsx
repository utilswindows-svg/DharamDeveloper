import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileDown, HardDrive, Search, Users, Download, TrendingUp, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
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
  date: string;
  time: string;
  size: string;
  device: string;
  ip: string;
  type: 'free' | 'licensed';
}

const allDownloads: DownloadRecord[] = [
  { id: 1, user: 'Rohit Sharma', email: 'rohit@example.com', fileName: 'WindowsCleanerPro-v2.5.1.exe', product: 'Windows Cleaner Pro', date: 'April 22, 2026', time: '14:32', size: '45.2 MB', device: 'Windows 11 PC', ip: '103.21.45.8', type: 'free' },
  { id: 2, user: 'Anita Verma', email: 'anita.v@example.com', fileName: 'SystemOptimizer-v1.8.0.exe', product: 'System Optimizer', date: 'April 22, 2026', time: '11:18', size: '38.7 MB', device: 'Windows 10 Laptop', ip: '49.207.12.144', type: 'free' },
  { id: 3, user: 'Karan Mehta', email: 'karan.m@example.com', fileName: 'PasswordManager-v3.2.0.exe', product: 'Password Manager', date: 'April 21, 2026', time: '20:05', size: '22.3 MB', device: 'Windows 11 PC', ip: '157.32.88.19', type: 'licensed' },
  { id: 4, user: 'Sneha Iyer', email: 'sneha.i@example.com', fileName: 'WindowsCleanerPro-v2.5.1.exe', product: 'Windows Cleaner Pro', date: 'April 21, 2026', time: '09:47', size: '45.2 MB', device: 'Windows 10 Desktop', ip: '202.83.17.55', type: 'free' },
  { id: 5, user: 'Amit Patel', email: 'amit.p@example.com', fileName: 'MSGtoPDF-v4.0.2.exe', product: 'MSG to PDF Converter', date: 'April 20, 2026', time: '16:21', size: '28.4 MB', device: 'Windows 11 Laptop', ip: '117.193.220.41', type: 'free' },
  { id: 6, user: 'Priya Nair', email: 'priya.n@example.com', fileName: 'DataRecovery-v5.1.0.exe', product: 'Data Recovery Tool', date: 'April 20, 2026', time: '08:55', size: '52.8 MB', device: 'Windows 11 PC', ip: '106.51.78.203', type: 'free' },
  { id: 7, user: 'Rahul Singh', email: 'rahul.s@example.com', fileName: 'PasswordManager-v3.1.5.exe', product: 'Password Manager', date: 'April 19, 2026', time: '13:09', size: '21.8 MB', device: 'Windows 10 PC', ip: '45.118.62.190', type: 'licensed' },
  { id: 8, user: 'Megha Joshi', email: 'megha.j@example.com', fileName: 'SystemOptimizer-v1.8.0.exe', product: 'System Optimizer', date: 'April 19, 2026', time: '10:14', size: '38.7 MB', device: 'Windows 11 Laptop', ip: '152.58.34.77', type: 'free' },
  { id: 9, user: 'Vikas Gupta', email: 'vikas.g@example.com', fileName: 'WindowsCleanerPro-v2.5.0.exe', product: 'Windows Cleaner Pro', date: 'April 18, 2026', time: '19:42', size: '44.9 MB', device: 'Windows 11 PC', ip: '49.36.182.11', type: 'free' },
  { id: 10, user: 'Neha Kapoor', email: 'neha.k@example.com', fileName: 'MSGtoPDF-v4.0.2.exe', product: 'MSG to PDF Converter', date: 'April 18, 2026', time: '07:30', size: '28.4 MB', device: 'Windows 10 Laptop', ip: '157.49.205.66', type: 'free' },
  { id: 11, user: 'Arjun Reddy', email: 'arjun.r@example.com', fileName: 'DataRecovery-v5.1.0.exe', product: 'Data Recovery Tool', date: 'April 17, 2026', time: '22:11', size: '52.8 MB', device: 'Windows 11 PC', ip: '103.156.42.18', type: 'licensed' },
  { id: 12, user: 'Pooja Desai', email: 'pooja.d@example.com', fileName: 'SystemOptimizer-v1.7.9.exe', product: 'System Optimizer', date: 'April 16, 2026', time: '15:38', size: '38.1 MB', device: 'Windows 10 Desktop', ip: '117.234.91.205', type: 'free' },
];

const AdminDownloads = () => {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const products = useMemo(
    () => Array.from(new Set(allDownloads.map((d) => d.product))),
    []
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
  }, [search, productFilter, typeFilter]);

  const totalDownloads = allDownloads.length;
  const freeDownloads = allDownloads.filter((d) => d.type === 'free').length;
  const uniqueUsers = new Set(allDownloads.map((d) => d.email)).size;
  const todayDownloads = allDownloads.filter((d) => d.date === 'April 22, 2026').length;

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
    </AdminLayout>
  );
};

export default AdminDownloads;