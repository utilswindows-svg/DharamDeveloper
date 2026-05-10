require('dotenv').config();
const { sequelize, Category, Product } = require('../models');

const CATEGORIES = [
  { key: 'email',        label: 'Email & Migration',  description: 'Migrate, convert, and export email data across formats and platforms.', sortOrder: 1 },
  { key: 'pdf',          label: 'PDF Tools',          description: 'Unlock, merge, split, compress, and convert PDF documents.',           sortOrder: 2 },
  { key: 'recovery',     label: 'Data Recovery',      description: 'Recover lost or deleted files from any storage device.',                sortOrder: 3 },
  { key: 'optimization', label: 'PC Optimization',    description: 'Speed up Windows, free disk space, and boost system performance.',     sortOrder: 4 },
];

const PRODUCTS = [
  { slug: 'mbox-to-pdf',   title: 'MBox to PDF Converter', tagline: 'Convert MBOX Mailbox Files to PDF with Attachments',         description: 'Professional tool to export MBOX emails to PDF with formatting, headers, and attachments preserved.',  icon: 'Mail',       color: 'text-primary', startingPrice: 29, categoryKey: 'email',        featured: true,  sortOrder: 1 },
  { slug: 'pst-migration', title: 'PST Migration Tool',    tagline: 'Migrate Outlook PST Files to Multiple Formats & Platforms', description: 'Seamlessly migrate Outlook PST files to Office 365, Gmail, Thunderbird, and 15+ formats without data loss.', icon: 'FileInput',  color: 'text-accent',  startingPrice: 39, categoryKey: 'email',        featured: false, sortOrder: 2 },
  { slug: 'msg-migration', title: 'MSG Migration Tool',    tagline: 'Convert & Migrate MSG Files to Multiple Formats',           description: 'Batch convert Outlook MSG files to PST, EML, MBOX, PDF and more while preserving all email properties.',     icon: 'MailOpen',   color: 'text-success', startingPrice: 29, categoryKey: 'email',        featured: false, sortOrder: 3 },
  { slug: 'msg-to-pdf',    title: 'MSG to PDF Converter',  tagline: 'Export Outlook MSG Messages to PDF Documents',              description: 'Transform Outlook MSG email files into professional PDF documents with formatting and attachments.',          icon: 'FileOutput', color: 'text-teal',    startingPrice: 29, categoryKey: 'email',        featured: false, sortOrder: 4 },
  { slug: 'pdf-tools',     title: 'PDF Tools Suite',       tagline: 'Unlock, Merge, Split, Compress & Convert PDF Files',        description: 'All-in-one toolkit for managing PDF documents — unlock, merge, split, compress, and convert.',                  icon: 'FileText',   color: 'text-accent',  startingPrice: 39, categoryKey: 'pdf',          featured: true,  sortOrder: 1 },
  { slug: 'data-recovery', title: 'Data Recovery Software',tagline: 'Recover Lost & Deleted Files from Any Storage Device',      description: 'Recover deleted, formatted, or lost files from hard drives, SSDs, USB drives, SD cards, and more.',         icon: 'HardDrive',  color: 'text-primary', startingPrice: 49, categoryKey: 'recovery',     featured: false, sortOrder: 1 },
  { slug: 'pc-optimizer',  title: 'PC Optimizer',          tagline: 'Speed Up Your Windows PC & Boost Performance',              description: 'Clean junk files, fix registry errors, manage startup programs, and optimize Windows performance.',           icon: 'Cpu',        color: 'text-success', startingPrice: 29, categoryKey: 'optimization', featured: false, sortOrder: 1 },
];

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const catMap = {};
    for (const c of CATEGORIES) {
      const [row] = await Category.upsert(c, { returning: true });
      catMap[c.key] = row.id;
    }

    for (const p of PRODUCTS) {
      const { categoryKey, ...rest } = p;
      await Product.upsert({ ...rest, categoryId: catMap[categoryKey] || null });
    }

    console.log(`✅ Seeded ${CATEGORIES.length} categories and ${PRODUCTS.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();