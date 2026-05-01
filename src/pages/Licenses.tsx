import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Eye, EyeOff, Download, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface License {
  id: number;
  licenseKey: string;
  software: string;
  systems: number;
  used: number;
  purchase: string;
  expiry: string;
  status: 'active' | 'expired' | 'trial';
  createdAt: string;
}

const Licenses = () => {
  const { toast } = useToast();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const licenses: License[] = [
    {
      id: 1,
      licenseKey: 'WCP-2026-A1B2-C3D4-E5F6',
      software: 'Windows Cleaner Pro',
      systems: 3,
      used: 2,
      purchase: 'March 15, 2026',
      expiry: 'March 15, 2027',
      status: 'active',
      createdAt: '2026-03-15 10:24:11',
    },
    {
      id: 6,
      licenseKey: 'MBX-2026-50PC-PDFC-9X7Q',
      software: 'MBOX to PDF Converter',
      systems: 50,
      used: 0,
      purchase: 'May 1, 2026',
      expiry: 'May 1, 2027',
      status: 'active',
      createdAt: '2026-05-01 09:00:00',
    },
    {
      id: 2,
      licenseKey: 'SOP-2026-X9Y8-Z7W6-V5U4',
      software: 'System Optimizer',
      systems: 1,
      used: 1,
      purchase: 'February 10, 2026',
      expiry: 'February 10, 2027',
      status: 'active',
      createdAt: '2026-02-10 16:45:02',
    },
    {
      id: 3,
      licenseKey: 'PWM-2026-K5L6-M7N8-O9P0',
      software: 'Password Manager',
      systems: 5,
      used: 3,
      purchase: 'January 5, 2026',
      expiry: 'January 5, 2027',
      status: 'active',
      createdAt: '2026-01-05 08:12:33',
    },
    {
      id: 4,
      licenseKey: 'TRL-2025-T1R2-I3A4-L5K6',
      software: 'MBOX to PDF Converter',
      systems: 1,
      used: 1,
      purchase: 'December 1, 2025',
      expiry: 'December 15, 2025',
      status: 'trial',
      createdAt: '2025-12-01 12:00:00',
    },
    {
      id: 5,
      licenseKey: 'OLD-2024-E7X8-P9I0-R1E2',
      software: 'PST Migration Tool',
      systems: 2,
      used: 2,
      purchase: 'May 20, 2024',
      expiry: 'May 20, 2025',
      status: 'expired',
      createdAt: '2024-05-20 09:30:45',
    },
  ];

  const totalLicenses = licenses.length;
  const activeCount = licenses.filter((l) => l.status === 'active').length;
  const trialCount = licenses.filter((l) => l.status === 'trial').length;
  const expiredCount = licenses.filter((l) => l.status === 'expired').length;

  const stats = [
    { label: 'Total Licenses', value: totalLicenses, icon: Key, color: 'text-accent' },
    { label: 'Active', value: activeCount, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Trial', value: trialCount, icon: Clock, color: 'text-amber-600' },
    { label: 'Expired', value: expiredCount, icon: XCircle, color: 'text-destructive' },
  ];

  const toggleReveal = (id: number) =>
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied!', description: 'License key copied to clipboard.' });
  };

  const maskKey = (key: string) =>
    key.replace(/[A-Z0-9](?=.*-....$)/g, '•');

  const statusBadge = (status: License['status']) => {
    const map = {
      active: 'bg-green-100 text-green-700 hover:bg-green-100',
      trial: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
      expired: 'bg-red-100 text-red-700 hover:bg-red-100',
    } as const;
    return <Badge className={map[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-hero text-hero-foreground py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Licenses</h1>
            <p className="text-xl text-hero-muted max-w-2xl mx-auto">
              Manage all your software license keys, activations, and expiry dates in one place.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Licenses Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-2xl font-bold">License Keys</h2>
                <p className="text-sm text-muted-foreground">
                  All your purchased and trial licenses
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                {totalLicenses} total
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Key</TableHead>
                    <TableHead>Software</TableHead>
                    <TableHead className="text-center">Systems</TableHead>
                    <TableHead className="text-center">Used</TableHead>
                    <TableHead>Purchase</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenses.map((lic) => (
                    <TableRow key={lic.id}>
                      <TableCell className="font-mono text-xs">
                        {revealed[lic.id] ? lic.licenseKey : maskKey(lic.licenseKey)}
                      </TableCell>
                      <TableCell className="font-medium">{lic.software}</TableCell>
                      <TableCell className="text-center">{lic.systems}</TableCell>
                      <TableCell className="text-center">
                        <span className={lic.used >= lic.systems ? 'text-destructive font-semibold' : ''}>
                          {lic.used}/{lic.systems}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{lic.purchase}</TableCell>
                      <TableCell className="whitespace-nowrap">{lic.expiry}</TableCell>
                      <TableCell>{statusBadge(lic.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {lic.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleReveal(lic.id)}
                            title={revealed[lic.id] ? 'Hide key' : 'Reveal key'}
                          >
                            {revealed[lic.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyKey(lic.licenseKey)}
                            title="Copy key"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Renew">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
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

export default Licenses;
