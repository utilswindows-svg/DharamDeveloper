import React, { useEffect, useMemo, useState } from 'react';
import SEO from "@/components/SEO";
import { motion } from 'framer-motion';
import { Download, Calendar, CheckCircle, FileDown, HardDrive, Loader2, XCircle } from 'lucide-react';
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
import { api } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

interface DownloadItem {
  id: number;
  orderId: number;
  name: string;
  productSlug: string;
  version: string;
  purchaseDate: string | null;
  expiryDate: string | null;
  status: 'active' | 'expired';
  downloadUrl: string;
}

interface HistoryItem {
  id: number;
  fileName: string;
  product: string;
  productSlug: string;
  version: string;
  size: string | null;
  device: string | null;
  createdAt: string;
}

const Downloads = () => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fmtDate = (d?: string | null) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return '—'; }
  };
  const fmtTime = (d: string) => {
    try { return new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  };

  const loadAll = async () => {
    try {
      const [d, h] = await Promise.all([
        api.get('/user/downloads'),
        api.get('/user/downloads/history'),
      ]);
      setDownloads(d.data?.downloads || []);
      setHistory(h.data?.history || []);
    } catch (err: any) {
      toast({
        title: 'Could not load downloads',
        description: err?.response?.data?.message || err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, []);

  const downloadCounts = useMemo(
    () => history.reduce<Record<string, number>>((acc, item) => {
      acc[item.product] = (acc[item.product] || 0) + 1;
      return acc;
    }, {}),
    [history]
  );
  const totalDownloads = history.length;

  const handleDownload = async (item: DownloadItem) => {
    setDownloadingId(item.id);
    try {
      await api.post(`/user/downloads/${item.orderId}/record`, {});
      toast({ title: 'Download started', description: `${item.name} ${item.version}` });
      await loadAll();
    } catch (err: any) {
      toast({
        title: 'Download failed',
        description: err?.response?.data?.message || err.message,
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

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
          {loading && (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center text-muted-foreground mb-12">
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading your downloads…
            </div>
          )}
          {!loading && downloads.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center text-muted-foreground mb-12">
              No purchased software yet. Buy a license to start downloading.
            </div>
          )}
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
                      {download.status === 'active' ? (
                        <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          expired
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Version {download.version}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Purchased</p>
                      <p className="font-medium">{fmtDate(download.purchaseDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry</p>
                      <p className="font-medium">{fmtDate(download.expiryDate)}</p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDownload(download)}
                      disabled={download.status !== 'active' || downloadingId === download.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === download.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Download className="h-4 w-4" />}
                      Download
                    </button>
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
                  {!loading && history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No downloads yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent" />
                          {fmtDate(item.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{fmtTime(item.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileDown className="h-4 w-4 text-success" />
                          <span className="font-mono text-xs">{item.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell className="text-muted-foreground">{item.size || '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <HardDrive className="h-4 w-4" />
                          {item.device || '—'}
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
