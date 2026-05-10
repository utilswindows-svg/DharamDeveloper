import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Monitor,
  Plus,
  Trash2,
  Settings2,
  Loader2,
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import SEO from "@/components/SEO";
import { api } from '@/store/authStore';

interface Activation {
  id: string;
  deviceName: string;
  activatedAt: string;
}

interface License {
  id: number;
  licenseKey: string;
  software: string;
  systems: number;
  purchase: string;
  expiry: string;
  status: 'active' | 'expired' | 'trial';
  createdAt: string;
  activations: Activation[];
}

const Licenses = () => {
  const { toast } = useToast();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [manageId, setManageId] = useState<number | null>(null);
  const [newDevice, setNewDevice] = useState('');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  const fmtDate = (d?: string | Date | null) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return '—'; }
  };
  const fmtDateTime = (d?: string | Date | null) => {
    if (!d) return '';
    try { return new Date(d).toISOString().replace('T', ' ').slice(0, 19); } catch { return ''; }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/user/orders');
        if (!mounted) return;
        const orders = (data?.orders || []) as any[];
        const mapped: License[] = orders
          .filter((o) => o.paymentStatus === 'paid' && o.licenseKey)
          .map((o) => {
            const now = Date.now();
            const exp = o.expiresAt ? new Date(o.expiresAt).getTime() : null;
            const status: License['status'] = exp && exp < now ? 'expired' : 'active';
            return {
              id: o.id,
              licenseKey: o.licenseKey,
              software: o.productTitle,
              systems: Number(o.seats) || 1,
              purchase: fmtDate(o.createdAt),
              expiry: fmtDate(o.expiresAt),
              status,
              createdAt: fmtDateTime(o.createdAt),
              activations: [],
            };
          });
        setLicenses(mapped);
      } catch (err: any) {
        toast({
          title: 'Could not load licenses',
          description: err?.response?.data?.message || err.message,
          variant: 'destructive',
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  // Per-license activation counting
  const getUsed = (lic: License) => lic.activations.length;
  const getRemaining = (lic: License) => Math.max(0, lic.systems - getUsed(lic));
  const getPercent = (lic: License) =>
    lic.systems === 0 ? 0 : Math.min(100, Math.round((getUsed(lic) / lic.systems) * 100));

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

  const managedLicense = useMemo(
    () => licenses.find((l) => l.id === manageId) ?? null,
    [licenses, manageId]
  );

  const activateDevice = () => {
    if (!managedLicense) return;
    const name = newDevice.trim();
    if (!name) {
      toast({ title: 'Device name required', variant: 'destructive' });
      return;
    }
    if (getRemaining(managedLicense) <= 0) {
      toast({
        title: 'No activations remaining',
        description: 'This license has reached its PC limit.',
        variant: 'destructive',
      });
      return;
    }
    if (managedLicense.activations.some((a) => a.deviceName.toLowerCase() === name.toLowerCase())) {
      toast({ title: 'Device already activated', variant: 'destructive' });
      return;
    }
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setLicenses((prev) =>
      prev.map((l) =>
        l.id === managedLicense.id
          ? {
              ...l,
              activations: [
                ...l.activations,
                { id: `${l.id}-${Date.now()}`, deviceName: name, activatedAt: now },
              ],
            }
          : l
      )
    );
    setNewDevice('');
    toast({ title: 'Device activated', description: `${name} added to ${managedLicense.software}.` });
  };

  const deactivateDevice = (activationId: string) => {
    if (!managedLicense) return;
    setLicenses((prev) =>
      prev.map((l) =>
        l.id === managedLicense.id
          ? { ...l, activations: l.activations.filter((a) => a.id !== activationId) }
          : l
      )
    );
    toast({ title: 'Device deactivated', description: 'PC slot is now available.' });
  };

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
      <SEO title="My Licenses" description="View and manage your WindowsUtils license keys and activations." path="/licenses" keywords="licenses, license keys, activations" type="website" noIndex />
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
                    <TableHead className="text-center">Total PCs</TableHead>
                    <TableHead className="min-w-[180px]">Activations (Used / Remaining)</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenses.map((lic) => {
                    const used = getUsed(lic);
                    const remaining = getRemaining(lic);
                    const percent = getPercent(lic);
                    const full = remaining === 0;
                    return (
                      <TableRow key={lic.id}>
                        <TableCell className="font-mono text-xs">
                          {revealed[lic.id] ? lic.licenseKey : maskKey(lic.licenseKey)}
                        </TableCell>
                        <TableCell className="font-medium">{lic.software}</TableCell>
                        <TableCell className="text-center">{lic.systems}</TableCell>
                        <TableCell>
                          <div className="space-y-1 min-w-[180px]">
                            <div className="flex items-center justify-between text-xs">
                              <span className={full ? 'text-destructive font-semibold' : 'font-medium'}>
                                {used} used
                              </span>
                              <span className="text-muted-foreground">
                                {remaining} remaining
                              </span>
                            </div>
                            <Progress value={percent} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{lic.expiry}</TableCell>
                        <TableCell>{statusBadge(lic.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setManageId(lic.id)}
                              title="Manage activations"
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manage Activations Dialog */}
      <Dialog open={manageId !== null} onOpenChange={(o) => !o && setManageId(null)}>
        <DialogContent className="max-w-2xl">
          {managedLicense && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-accent" />
                  {managedLicense.software} — Activations
                </DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  {managedLicense.licenseKey}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total PCs</p>
                  <p className="text-2xl font-bold">{managedLicense.systems}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Used</p>
                  <p className="text-2xl font-bold text-accent">{getUsed(managedLicense)}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p
                    className={`text-2xl font-bold ${
                      getRemaining(managedLicense) === 0 ? 'text-destructive' : 'text-green-600'
                    }`}
                  >
                    {getRemaining(managedLicense)}
                  </p>
                </div>
              </div>

              <Progress value={getPercent(managedLicense)} className="h-2 mb-4" />

              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Device name (e.g. PC-MIGRATION-04)"
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && activateDevice()}
                />
                <Button onClick={activateDevice} disabled={getRemaining(managedLicense) === 0}>
                  <Plus className="h-4 w-4 mr-1" /> Activate
                </Button>
              </div>

              <div className="border border-border rounded-lg max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Activated At</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {managedLicense.activations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                          No devices activated yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {managedLicense.activations.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.deviceName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{a.activatedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deactivateDevice(a.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Deactivate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setManageId(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Licenses;
