import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, Calendar, X, Plus, Check, Trash2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from "@/components/SEO";

const Billing = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Credit Card',
      name: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
  ]);

  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeletePaymentMethod = (id: number) => {
    setPaymentMethods(prev => {
      const filtered = prev.filter(m => m.id !== id);
      if (filtered.length > 0 && !filtered.some(m => m.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };
  const handleDownloadInvoice = (invoice: any) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      // Header
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('WINDOWS UTILS', margin, yPos);
      yPos += 10;

      // Invoice title
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('INVOICE', margin, yPos);
      yPos += 8;

      // Invoice details
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Invoice Number: ${invoice.id}`, margin, yPos);
      yPos += 6;
      doc.text(`Date: ${invoice.date}`, margin, yPos);
      yPos += 10;

      // Bill to section
      doc.setFont(undefined, 'bold');
      doc.text('BILL TO:', margin, yPos);
      yPos += 6;
      doc.setFont(undefined, 'normal');
      doc.text('John Doe', margin, yPos);
      yPos += 5;
      doc.text('john@example.com', margin, yPos);
      yPos += 5;
      doc.text('+1 (555) 123-4567', margin, yPos);
      yPos += 10;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Invoice items table header
      doc.setFont(undefined, 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 6, 'F');
      doc.text('Description', margin + 2, yPos + 4);
      doc.text('Amount', pageWidth - margin - 25, yPos + 4);
      yPos += 8;

      // Invoice items
      doc.setFont(undefined, 'normal');
      doc.text(invoice.description, margin + 2, yPos);
      doc.text(invoice.amount, pageWidth - margin - 25, yPos);
      yPos += 8;

      // Summary section
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      const subtotalAmount = parseFloat(invoice.amount.replace('$', ''));
      const taxAmount = subtotalAmount * 0.18;
      const totalAmount = subtotalAmount + taxAmount;

      doc.setFont(undefined, 'normal');
      doc.text('Subtotal:', pageWidth - margin - 50, yPos);
      doc.text(`$${subtotalAmount.toFixed(2)}`, pageWidth - margin - 20, yPos);
      yPos += 6;

      doc.text('Tax (18%):', pageWidth - margin - 50, yPos);
      doc.text(`$${taxAmount.toFixed(2)}`, pageWidth - margin - 20, yPos);
      yPos += 8;

      doc.setFont(undefined, 'bold');
      doc.setFillColor(245, 245, 245);
      doc.rect(pageWidth - margin - 55, yPos - 3, 55, 8, 'F');
      doc.text('Total Amount Due:', pageWidth - margin - 50, yPos + 2);
      doc.text(`$${totalAmount.toFixed(2)}`, pageWidth - margin - 20, yPos + 2);
      yPos += 12;

      // Terms section
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;

      doc.setFont(undefined, 'bold');
      doc.text('TERMS:', margin, yPos);
      yPos += 5;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text(`Payment Terms: Net 30`, margin, yPos);
      yPos += 4;
      doc.text(`License Type: Annual`, margin, yPos);
      yPos += 4;
      doc.text(`Status: ${invoice.status.toUpperCase()}`, margin, yPos);
      yPos += 8;

      // Footer section
      yPos = pageHeight - 30;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;

      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.text('Windows Utils Support', margin, yPos);
      yPos += 4;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text('Email: support@windowsutils.com', margin, yPos);
      yPos += 3;
      doc.text('Phone: +1 (555) 123-4567', margin, yPos);
      yPos += 3;
      doc.text('Website: https://windowsutils.com', margin, yPos);

      // Save PDF
      doc.save(`${invoice.id}-invoice.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating invoice PDF');
    }
  };

  const invoices = [
    {
      id: 'INV-2026-001',
      date: 'March 15, 2026',
      description: 'Windows Cleaner Pro - Annual License',
      amount: '$49.99',
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'INV-2026-002',
      date: 'February 10, 2026',
      description: 'System Optimizer - Annual License',
      amount: '$39.99',
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'INV-2026-003',
      date: 'January 5, 2026',
      description: 'Password Manager - Annual License',
      amount: '$29.99',
      status: 'paid',
      downloadUrl: '#',
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Billing & Invoices" description="View your billing history, invoices, and payment methods." path="/billing" keywords="billing, invoices, payments" type="website" noIndex />
      <Navbar />

      {/* Header */}
      <section className="bg-hero text-hero-foreground py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Billing & Invoices</h1>
            <p className="text-hero-muted">Manage your invoices and payment methods</p>
          </motion.div>
        </div>
      </section>

      {/* Billing Content */}
      <section className="py-12">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Invoices */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6">Recent Invoices</h2>
                <div className="space-y-4">
                  {invoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{invoice.id}</h3>
                          <p className="text-sm text-muted-foreground">{invoice.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-accent">{invoice.amount}</p>
                          <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full font-semibold">
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {invoice.date}
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownloadInvoice(invoice);
                          }}
                          className="flex items-center gap-1 text-accent hover:underline cursor-pointer"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Payment Methods */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Payment Methods</h2>
                  <button
                    onClick={() => setShowAddPaymentForm(!showAddPaymentForm)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-accent text-white rounded hover:opacity-90 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {/* Add Payment Method Form */}
                <AnimatePresence>
                  {showAddPaymentForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 border border-border rounded-lg bg-gray-50"
                    >
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Add a Payment Method
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        For your security, we never collect raw card details on this site.
                        Payment methods are added through our PCI-compliant payment partner
                        (PayPal) during checkout. Complete a purchase to save a new method.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="/"
                          className="flex-1 px-3 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-all font-medium text-center"
                        >
                          Browse Products
                        </a>
                        <button
                          type="button"
                          onClick={() => setShowAddPaymentForm(false)}
                          className="flex-1 px-3 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment Methods List */}
                <div className="space-y-3">
                  {paymentMethods.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No payment methods added yet.</p>
                  ) : (
                    paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border-2 border-border rounded-lg p-4 hover:border-accent transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <CreditCard className="h-5 w-5 text-accent flex-shrink-0" />
                            <div>
                              <p className="font-semibold">{method.name}</p>
                              <p className="text-sm text-muted-foreground">•••• {method.last4}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!method.isDefault && (
                              <button
                                onClick={() => handleSetDefault(method.id)}
                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePaymentMethod(method.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Expires {method.expiry}</span>
                          {method.isDefault && (
                            <span className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded font-semibold">
                              <Check className="h-3 w-3" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Billing Summary */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-semibold mb-4">Billing Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>$119.97</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span>$21.59</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-accent">$141.56</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Billing;