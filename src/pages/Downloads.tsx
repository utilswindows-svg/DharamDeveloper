import React from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

  return (
    <div className="min-h-screen">
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
          <div className="grid gap-6">
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

          {downloads.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground mb-4">No downloads available yet.</p>
              <a href="/buy/cleaner" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-all">
                Browse Products
              </a>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Downloads;