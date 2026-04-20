import { Mail, FileInput, MailOpen, FileOutput, HardDrive, FileText, Cpu } from "lucide-react";

export interface LicenseData {
  name: string;
  price: number;
  originalPrice?: number;
  machines: string;
  desc: string;
}

export interface ReviewData {
  name: string;
  role: string;
  rating: number;
  text: string;
  initials: string;
}

export interface ScreenshotData {
  title: string;
  caption: string;
  accent: string; // tailwind gradient classes for the mock screen
}

export interface ProductData {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  color: string;
  features: { title: string; desc: string }[];
  steps: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  systemReqs: string[];
  formats?: string[];
  licenses: LicenseData[];
  screenshots?: ScreenshotData[];
  videoUrl?: string;
  videoPoster?: string;
  reviews?: ReviewData[];
}

// Shared defaults applied to every product (can be overridden per product)
const defaultScreenshots: ScreenshotData[] = [
  { title: "Main Dashboard", caption: "Clean, intuitive interface — get started in seconds.", accent: "from-primary/30 to-accent/20" },
  { title: "Smart Preview", caption: "Preview files before processing to avoid surprises.", accent: "from-accent/30 to-success/20" },
  { title: "Batch Processing", caption: "Run hundreds of operations in a single workflow.", accent: "from-success/30 to-teal/20" },
  { title: "Detailed Reports", caption: "Track progress with real-time logs and reports.", accent: "from-teal/30 to-primary/20" },
];

const defaultReviews: ReviewData[] = [
  { name: "Sarah Mitchell", role: "IT Administrator", rating: 5, initials: "SM", text: "Saved us countless hours on a major migration project. The batch mode just works — exactly what we needed." },
  { name: "David Chen", role: "Legal Consultant", rating: 5, initials: "DC", text: "Reliable, fast, and the support team responds quickly. Worth every dollar for our firm's daily workflow." },
  { name: "Priya Sharma", role: "Small Business Owner", rating: 4, initials: "PS", text: "Easy to install and very intuitive. I had everything converted in under an hour with zero data loss." },
  { name: "Marcus Johnson", role: "Freelance Developer", rating: 5, initials: "MJ", text: "Best tool I've used in this category. The interface is clean and there are no annoying upsells." },
];

const defaultVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

export const products: Record<string, ProductData> = {
  "mbox-to-pdf": {
    slug: "mbox-to-pdf",
    title: "MBox to PDF Converter",
    tagline: "Convert MBOX Mailbox Files to PDF with Attachments",
    description:
      "WindowsUtils MBox to PDF Converter is a professional tool to export MBOX emails to PDF format. It preserves email formatting, headers, attachments, and folder structure during conversion. Supports Thunderbird, Apple Mail, Google Takeout, and other MBOX-compatible clients.",
    icon: Mail,
    color: "text-primary",
    features: [
      { title: "Batch Conversion", desc: "Convert multiple MBOX files to PDF simultaneously, saving time on large mailboxes." },
      { title: "Attachment Handling", desc: "Embeds or exports email attachments alongside the converted PDF files." },
      { title: "Preserve Formatting", desc: "Maintains original email formatting including HTML, images, and hyperlinks." },
      { title: "Date Range Filter", desc: "Select specific emails by date range for targeted conversion." },
      { title: "Folder Structure", desc: "Keeps the original folder hierarchy intact during conversion." },
      { title: "Multiple MBOX Sources", desc: "Supports Thunderbird, Apple Mail, Gmail Takeout, Eudora, and more." },
    ],
    steps: [
      { step: "01", title: "Add MBOX Files", desc: "Browse and select MBOX files or entire folders for conversion." },
      { step: "02", title: "Set Preferences", desc: "Choose output settings like page layout, date filters, and attachment options." },
      { step: "03", title: "Convert to PDF", desc: "Click Convert and get your PDF files in seconds with full email content preserved." },
    ],
    faqs: [
      { q: "Can I convert Google Takeout MBOX to PDF?", a: "Yes, the tool fully supports Google Takeout MBOX files and converts them to PDF with all content intact." },
      { q: "Does it preserve email attachments?", a: "Yes, attachments can be embedded within the PDF or saved separately in a designated folder." },
      { q: "Is there a file size limit?", a: "No, the tool handles MBOX files of any size with optimized memory management." },
      { q: "Can I filter emails by date?", a: "Yes, you can set a date range to convert only specific emails from your MBOX file." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1 GHz processor or faster", "512 MB RAM (1 GB recommended)", "50 MB free disk space for installation", "Microsoft .NET Framework 4.5 or above"],
    formats: ["MBOX", "MBX", "MBS"],
    licenses: [
      { name: "Personal License", price: 29, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 49, originalPrice: 78, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 149, originalPrice: 298, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 199, originalPrice: 398, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
  "pst-migration": {
    slug: "pst-migration",
    title: "PST Migration Tool",
    tagline: "Migrate Outlook PST Files to Multiple Formats & Platforms",
    description:
      "WindowsUtils PST Migration Tool enables seamless migration of Outlook PST files to various email formats and cloud platforms. Export PST to Office 365, Gmail, Thunderbird, and 15+ file formats without data loss.",
    icon: FileInput,
    color: "text-accent",
    features: [
      { title: "15+ Export Formats", desc: "Migrate PST to EML, MSG, MBOX, PDF, HTML, CSV, vCard, ICS, and more." },
      { title: "Cloud Migration", desc: "Direct migration to Office 365, Gmail, Yahoo Mail, and IMAP servers." },
      { title: "Selective Migration", desc: "Choose specific folders, emails, contacts, or calendars to migrate." },
      { title: "Split Large PST", desc: "Automatically split large PST files during migration for better management." },
      { title: "Maintain Hierarchy", desc: "Preserves folder structure, email properties, and metadata during migration." },
      { title: "Orphan PST Support", desc: "Migrate orphan PST files without needing Outlook installed." },
    ],
    steps: [
      { step: "01", title: "Load PST File", desc: "Add single or multiple PST files including password-protected ones." },
      { step: "02", title: "Choose Destination", desc: "Select the target format or cloud platform for migration." },
      { step: "03", title: "Start Migration", desc: "Hit Migrate and let the tool handle the complete transfer process." },
    ],
    faqs: [
      { q: "Do I need Outlook installed?", a: "No, the tool works independently without requiring Microsoft Outlook installation." },
      { q: "Can I migrate to Office 365?", a: "Yes, direct migration to Office 365 mailboxes is fully supported with admin and user-level access." },
      { q: "Does it support password-protected PST?", a: "Yes, simply enter the password when prompted and the tool will process the file." },
      { q: "Can I migrate contacts and calendars?", a: "Yes, the tool migrates emails, contacts, calendars, tasks, and notes from PST files." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1 GHz processor or faster", "1 GB RAM (2 GB recommended)", "100 MB free disk space for installation", "Microsoft .NET Framework 4.5 or above"],
    formats: ["PST", "OST"],
    licenses: [
      { name: "Personal License", price: 39, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 69, originalPrice: 118, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 179, originalPrice: 348, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 249, originalPrice: 498, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
  "msg-migration": {
    slug: "msg-migration",
    title: "MSG Migration Tool",
    tagline: "Convert & Migrate MSG Files to Multiple Formats",
    description:
      "WindowsUtils MSG Migration Tool provides a complete solution for converting Outlook MSG files to various email formats. Batch convert MSG to PST, EML, MBOX, PDF, and more while preserving all email properties.",
    icon: MailOpen,
    color: "text-success",
    features: [
      { title: "Bulk MSG Conversion", desc: "Process thousands of MSG files in a single batch operation." },
      { title: "10+ Output Formats", desc: "Convert MSG to PST, EML, MBOX, PDF, HTML, RTF, DOC, and more." },
      { title: "Preserve Metadata", desc: "Retains email headers, sender/recipient info, timestamps, and attachments." },
      { title: "Naming Convention", desc: "Apply custom naming conventions to output files using subject, date, or sender." },
      { title: "Folder Mode", desc: "Add an entire folder of MSG files for instant batch processing." },
      { title: "Search & Filter", desc: "Filter MSG files by date, subject, sender, or attachment status before conversion." },
    ],
    steps: [
      { step: "01", title: "Add MSG Files", desc: "Select individual MSG files or load an entire folder at once." },
      { step: "02", title: "Select Output Format", desc: "Pick the desired output format from the available options." },
      { step: "03", title: "Convert Files", desc: "Click Convert and download your files in the chosen format." },
    ],
    faqs: [
      { q: "Can I convert MSG to PST?", a: "Yes, you can merge multiple MSG files into a single PST file with folder structure." },
      { q: "Does it work without Outlook?", a: "Yes, the tool operates independently and does not require Outlook to be installed." },
      { q: "How many MSG files can I convert at once?", a: "There is no limit — the tool handles thousands of MSG files in batch mode." },
      { q: "Are embedded images preserved?", a: "Yes, all inline images and embedded content are fully preserved during conversion." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1 GHz processor or faster", "512 MB RAM (1 GB recommended)", "50 MB free disk space for installation", "Microsoft .NET Framework 4.5 or above"],
    formats: ["MSG"],
    licenses: [
      { name: "Personal License", price: 29, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 49, originalPrice: 78, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 149, originalPrice: 298, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 199, originalPrice: 398, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
  "msg-to-pdf": {
    slug: "msg-to-pdf",
    title: "MSG to PDF Converter",
    tagline: "Export Outlook MSG Messages to PDF Documents",
    description:
      "WindowsUtils MSG to PDF Converter transforms Outlook MSG email files into professional PDF documents. Preserve email formatting, headers, attachments, and images during the conversion process.",
    icon: FileOutput,
    color: "text-teal",
    features: [
      { title: "High-Quality PDF Output", desc: "Generates industry-standard PDF files with perfect formatting." },
      { title: "Batch Processing", desc: "Convert hundreds of MSG files to PDF in one go." },
      { title: "Attachment Options", desc: "Embed attachments in PDF or save them in a separate folder." },
      { title: "Page Layout Settings", desc: "Customize page size, margins, orientation, and header/footer." },
      { title: "Bates Numbering", desc: "Add Bates stamps to PDF pages for legal document management." },
      { title: "Print & Share Ready", desc: "Output PDFs are optimized for printing and email sharing." },
    ],
    steps: [
      { step: "01", title: "Import MSG Files", desc: "Drag and drop or browse to select MSG files for conversion." },
      { step: "02", title: "Configure PDF Settings", desc: "Adjust page layout, attachment handling, and naming conventions." },
      { step: "03", title: "Export to PDF", desc: "Generate PDFs instantly with all email content preserved." },
    ],
    faqs: [
      { q: "Is Bates numbering supported?", a: "Yes, you can add Bates stamps with custom prefixes and numbering to all PDF pages." },
      { q: "Can I set custom page sizes?", a: "Yes, the tool supports A4, Letter, Legal, and custom page dimensions." },
      { q: "Does it handle MSG files with large attachments?", a: "Yes, the tool processes MSG files of any size with attachments efficiently." },
      { q: "Can I use it for legal discovery?", a: "Absolutely — with Bates numbering and metadata preservation, it's ideal for e-discovery workflows." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1 GHz processor or faster", "512 MB RAM (1 GB recommended)", "50 MB free disk space for installation", "Microsoft .NET Framework 4.5 or above"],
    formats: ["MSG"],
    licenses: [
      { name: "Personal License", price: 29, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 49, originalPrice: 78, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 149, originalPrice: 298, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 199, originalPrice: 398, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
  "data-recovery": {
    slug: "data-recovery",
    title: "Data Recovery Software",
    tagline: "Recover Lost & Deleted Files from Any Storage Device",
    description:
      "WindowsUtils Data Recovery is a powerful tool to recover deleted, formatted, or lost files from hard drives, SSDs, USB drives, SD cards, and other storage media. Advanced scanning algorithms ensure maximum data retrieval.",
    icon: HardDrive,
    color: "text-primary",
    features: [
      { title: "Deep Scan Technology", desc: "Advanced algorithms locate files even from severely damaged or formatted drives." },
      { title: "300+ File Types", desc: "Recover documents, photos, videos, emails, archives, and more." },
      { title: "Multiple Devices", desc: "Supports HDD, SSD, USB drives, SD cards, external drives, and RAID arrays." },
      { title: "Preview Before Recovery", desc: "Preview recoverable files before saving to ensure data quality." },
      { title: "Partition Recovery", desc: "Recover data from deleted, lost, or damaged disk partitions." },
      { title: "Raw Recovery Mode", desc: "Signature-based recovery for severely corrupted storage devices." },
    ],
    steps: [
      { step: "01", title: "Select Drive", desc: "Choose the storage device or partition to scan for lost data." },
      { step: "02", title: "Scan & Preview", desc: "Run Quick or Deep scan and preview recoverable files." },
      { step: "03", title: "Recover Files", desc: "Select the files you need and save them to a safe location." },
    ],
    faqs: [
      { q: "Can I recover formatted drive data?", a: "Yes, the Deep Scan mode can recover files from formatted drives and partitions." },
      { q: "Does it support SSD recovery?", a: "Yes, the tool supports SSD recovery though results depend on TRIM status." },
      { q: "Can I recover specific file types?", a: "Yes, you can filter by file type to recover only the files you need." },
      { q: "Is the recovered data intact?", a: "In most cases, yes. The preview feature lets you verify file integrity before recovery." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1.5 GHz processor or faster", "1 GB RAM (2 GB recommended)", "100 MB free disk space for installation", "Administrator privileges required"],
    licenses: [
      { name: "Personal License", price: 49, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 99, originalPrice: 148, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 199, originalPrice: 398, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 299, originalPrice: 598, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
  "pdf-tools": {
    slug: "pdf-tools",
    title: "PDF Tools Suite",
    tagline: "Unlock, Merge, Split, Compress & Convert PDF Files",
    description:
      "WindowsUtils PDF Tools Suite is an all-in-one toolkit for managing PDF documents. Unlock restricted PDFs, merge multiple files, split large documents, compress file size, and convert to various formats.",
    icon: FileText,
    color: "text-accent",
    features: [
      { title: "PDF Unlock", desc: "Remove owner password restrictions — print, copy, and edit locked PDFs." },
      { title: "Merge PDFs", desc: "Combine multiple PDF files into a single document with page reordering." },
      { title: "Split PDF", desc: "Split large PDFs by page range, bookmarks, or fixed page count." },
      { title: "PDF Compression", desc: "Reduce PDF file size without compromising visible quality." },
      { title: "PDF to Word/Excel", desc: "Convert PDF documents to editable Word, Excel, PowerPoint, and image formats." },
      { title: "Watermark & Security", desc: "Add text or image watermarks and set password protection on PDFs." },
    ],
    steps: [
      { step: "01", title: "Choose Action", desc: "Select the PDF operation you need — unlock, merge, split, convert, etc." },
      { step: "02", title: "Add PDF Files", desc: "Import one or more PDF files for processing." },
      { step: "03", title: "Process & Save", desc: "Execute the action and download your processed PDF files." },
    ],
    faqs: [
      { q: "Can I remove PDF passwords?", a: "Yes, the tool removes owner-level restrictions. User passwords require the correct password to open." },
      { q: "How much can it compress PDFs?", a: "Typical compression reduces file size by 40–70% depending on content type." },
      { q: "Does it convert scanned PDFs?", a: "Yes, with built-in OCR support, scanned PDFs can be converted to editable formats." },
      { q: "Can I merge different-sized PDFs?", a: "Yes, you can merge PDFs of any page size into a single document." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1 GHz processor or faster", "512 MB RAM (1 GB recommended)", "100 MB free disk space for installation", "Microsoft .NET Framework 4.5 or above"],
    formats: ["PDF"],
    licenses: [
      { name: "Personal License", price: 39, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 69, originalPrice: 118, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 179, originalPrice: 348, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 249, originalPrice: 498, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
  "pc-optimizer": {
    slug: "pc-optimizer",
    title: "PC Optimizer",
    tagline: "Speed Up Your Windows PC & Boost Performance",
    description:
      "WindowsUtils PC Optimizer is a comprehensive system utility to clean junk files, fix registry errors, manage startup programs, and optimize Windows performance. Keep your PC running fast and smooth.",
    icon: Cpu,
    color: "text-success",
    features: [
      { title: "Junk File Cleaner", desc: "Remove temporary files, cache, logs, and other system junk safely." },
      { title: "Registry Repair", desc: "Scan and fix Windows registry errors to prevent crashes and slowdowns." },
      { title: "Startup Manager", desc: "Control which programs run at startup to reduce boot time." },
      { title: "Disk Defragmentation", desc: "Optimize disk layout for faster file access on traditional hard drives." },
      { title: "Privacy Cleaner", desc: "Clear browser history, cookies, and application traces for privacy protection." },
      { title: "System Monitor", desc: "Real-time monitoring of CPU, memory, disk, and network usage." },
    ],
    steps: [
      { step: "01", title: "Scan Your PC", desc: "Run a complete system scan to identify issues and optimization opportunities." },
      { step: "02", title: "Review Results", desc: "See detailed reports of junk files, registry issues, and performance problems." },
      { step: "03", title: "Optimize Now", desc: "Fix all issues with one click and enjoy a faster, cleaner PC." },
    ],
    faqs: [
      { q: "Is it safe to clean the registry?", a: "Yes, the tool creates automatic backups before making any registry changes for complete safety." },
      { q: "How much space can it free up?", a: "Results vary — typical cleanups free 2–10 GB of disk space by removing junk and temporary files." },
      { q: "Will it speed up my PC?", a: "Yes, by removing junk, fixing errors, and managing startup programs, your PC will feel noticeably faster." },
      { q: "Does it work on Windows 11?", a: "Yes, the tool is fully compatible with Windows 11, 10, 8.1, 8, and 7." },
    ],
    systemReqs: ["Windows 11, 10, 8.1, 8, 7 (32-bit & 64-bit)", "1 GHz processor or faster", "512 MB RAM", "30 MB free disk space for installation", "Administrator privileges recommended"],
    licenses: [
      { name: "Personal License", price: 29, machines: "1 Machine", desc: "The Personal License can be installed on one machine (desktop or laptop)." },
      { name: "Business License", price: 49, originalPrice: 78, machines: "Up to 100 Machines", desc: "The Business License can be installed on up to 100 machines within your organization." },
      { name: "Enterprise License", price: 129, originalPrice: 258, machines: "Up to 500 Machines", desc: "The Enterprise License can be installed on up to 500 machines enterprise-wide." },
      { name: "Technician License", price: 179, originalPrice: 358, machines: "Unlimited Machines", desc: "The Technician License allows unlimited installations for service providers and IT professionals." },
    ],
  },
};

// Inject shared defaults so every product page has screenshots, video, and reviews.
Object.values(products).forEach((p) => {
  if (!p.screenshots) p.screenshots = defaultScreenshots;
  if (!p.videoUrl) p.videoUrl = defaultVideo;
  if (!p.reviews) p.reviews = defaultReviews;
});
