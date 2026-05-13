import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, FileText, HardDrive, Cpu, FileInput, MailOpen, FileOutput, ArrowRight } from "lucide-react";

const allProducts = [
  {
    icon: Mail,
    title: "MBox to PDF",
    desc: "Convert MBOX mailbox files to PDF format with attachments intact. Batch processing supported.",
    href: "/software/mbox-to-pdf",
    color: "text-primary",
    borderColor: "border-primary/20",
    active: true,
  },
  {
    icon: FileInput,
    title: "PST Migration",
    desc: "Migrate Outlook PST files to multiple formats and cloud platforms seamlessly.",
    href: "/software/pst-migration",
    color: "text-accent",
    borderColor: "border-accent/20",
    active: false,
  },
  {
    icon: MailOpen,
    title: "MSG Migration",
    desc: "Convert and migrate MSG email files to PDF, PST, EML, and other formats with ease.",
    href: "/software/msg-migration",
    color: "text-success",
    borderColor: "border-success/20",
    active: false,
  },
  {
    icon: FileOutput,
    title: "MSG to PDF",
    desc: "Export Outlook MSG messages to PDF documents preserving formatting and attachments.",
    href: "/software/msg-to-pdf",
    color: "text-teal",
    borderColor: "border-teal/20",
    active: false,
  },
  {
    icon: HardDrive,
    title: "Data Recovery",
    desc: "Recover lost or deleted files from hard drives, SSDs, USB drives, and memory cards.",
    href: "/software/data-recovery",
    color: "text-primary",
    borderColor: "border-primary/20",
    active: false,
  },
  {
    icon: FileText,
    title: "PDF Unlocker",
    desc: "Unlock, merge, split, compress, and convert PDF files with our comprehensive toolkit.",
    href: "/software/pdf-tools",
    color: "text-accent",
    borderColor: "border-accent/20",
    active: true,
  },
  {
    icon: Cpu,
    title: "PC Optimizer",
    desc: "Speed up your Windows PC by cleaning junk files, fixing registry errors, and optimizing performance.",
    href: "/software/pc-optimizer",
    color: "text-success",
    borderColor: "border-success/20",
    active: false,
  },
];

const products = allProducts.filter(p => p.active);

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Our Products</span>
          <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground sm:text-4xl">
            Featured Solutions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Professional Windows utility tools designed to simplify your workflow and protect your data.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={product.href}
                className={`group flex h-full flex-col rounded-xl border ${product.borderColor} bg-card p-6 card-hover`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${product.color}`}>
                  <product.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground">{product.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{product.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
