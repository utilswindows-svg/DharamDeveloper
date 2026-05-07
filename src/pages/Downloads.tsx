import React from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, CheckCircle, FileDown, HardDrive } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
import SEO from "@/components/SEO";
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Downloads = () => {
  const downloads = [
    {
      id: 1,
      name: 'Windows Cleaner Pro',
      version: 'v2.5.1',
      purchaseDate: 'March 15, 2026',
      expiryDate: 'March 15, 2027',
      status: 'active',
      downloadUrl: '#',
    },
    {
      id: 2,
      name: 'System Optimizer',
      version: 'v1.8.0',
      purchaseDate: 'February 10, 2026',
      expiryDate: 'February 10, 2027',
      status: 'active',
      downloadUrl: '#',
    },
    {
      id: 3,
      name: 'Password Manager',
      version: 'v3.2.0',
      purchaseDate: 'January 5, 2026',
      expiryDate: 'January 5, 2027',
      status: 'active',
      downloadUrl: '#',
    },
  ];

  // Date-wise .exe download history
  const downloadHistory = [
    { id: 1, fileName: 'WindowsCleanerPro-v2.5.1.exe', product: 'Windows Cleaner Pro', date: 'April 18, 2026', time: '14:32', size: '45.2 MB', device: 'Windows 11 PC' },
    { id: 2, fileName: 'SystemOptimizer-v1.8.0.exe', product: 'System Optimizer', date: 'April 15, 2026', time: '09:18', size: '38.7 MB', device: 'Windows 10 Laptop' },
    { id: 3, fileName: 'WindowsCleanerPro-v2.5.0.exe', product: 'Windows Cleaner Pro', date: 'April 02, 2026', time: '20:05', size: '44.9 MB', device: 'Windows 11 PC' },
    { id: 4, fileName: 'PasswordManager-v3.2.0.exe', product: 'Password Manager', date: 'March 28, 2026', time: '11:47', size: '22.3 MB', device: 'Windows 11 PC' },
    { id: 5, fileName: 'SystemOptimizer-v1.7.9.exe', product: 'System Optimizer', date: 'March 12, 2026', time: '16:21', size: '38.1 MB', device: 'Windows 10 Laptop' },
    { id: 6, fileName: 'WindowsCleanerPro-v2.4.8.exe', product: 'Windows Cleaner Pro', date: 'February 22, 2026', time: '08:55', size: '44.2 MB', device: 'Windows 11 PC' },
    { id: 7, fileName: 'PasswordManager-v3.1.5.exe', product: 'Password Manager', date: 'January 18, 2026', time: '13:09', size: '21.8 MB', device: 'Windows 11 PC' },
  ];

  // Group counts per product
  const downloadCounts = downloadHistory.reduce<Record<string, number>>((acc, item) => {
    acc[item.product] = (acc[item.product] || 0) + 1;
    return acc;
  }, {});

  const totalDownloads = downloadHistory.length;

  return (
    <div className="min-h-screen">
      <SEO title="My Downloads" description="Access your purchased WindowsUtils software downloads." path="/downloads" keywords="downloads, my software" type="website" noIndex />
      <Navbar />

      {/* Header */}
      <section className="bg-hero text-hero-foreground py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">My Downloads</h1>
            <p className="text-hero-muted">Access your purchased software and licenses</p>
          </motion.div>
        </div>
      </section>

      {/* Downloads Content */}
      <section className="py-12">
        <div className="section-container">
          {/* Stats summary */}
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileDown className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
              <p className="text-3xl font-bold">{totalDownloads}</p>
            </motion.div>

            {Object.entries(downloadCounts).map(([product, count], idx) => (
              <motion.div
                key={product}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Download className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{product}</p>
                </div>
                <p className="text-3xl font-bold">{count}<span className="text-base font-normal text-muted-foreground ml-1">.exe</span></p>
              </motion.div>
            ))}
          </div>

          {/* Active licenses */}
          <h2 className="text-2xl font-bold mb-6">Active Licenses</h2>
          <div className="grid gap-6 mb-12">
            {downloads.map((download, index) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{download.name}</h3>
                      <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {download.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Version {download.version}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Purchased</p>
                      <p className="font-medium">{download.purchaseDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry</p>
                      <p className="font-medium">{download.expiryDate}</p>
                    </div>
                  </div>
                  <div>
                    <a
                      href={download.downloadUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Date-wise download history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold">Download History</h2>
                <p className="text-sm text-muted-foreground">Date-wise log of every .exe file you downloaded</p>
              </div>
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                {totalDownloads} files
              </span>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloadHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent" />
                          {item.date}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileDown className="h-4 w-4 text-success" />
                          <span className="font-mono text-xs">{item.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell className="text-muted-foreground">{item.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <HardDrive className="h-4 w-4" />
                          {item.device}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Downloads;
