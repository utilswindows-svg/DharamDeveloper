import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const contactBlocks = [
  { icon: Mail, label: "Support Email", value: "support@example.com", color: "primary" },
  { icon: Mail, label: "Sales Email", value: "sales@example.com", color: "accent" },
  { icon: Phone, label: "Support Phone", value: "+91 98765 43210", color: "success" },
  { icon: Phone, label: "Sales Phone", value: "+91 98765 43211", color: "teal" },
  { icon: MapPin, label: "Office Address", value: "5th Floor, Tech Park, Mumbai, India 400001", color: "primary" },
  { icon: Globe, label: "Website", value: "www.example.com", color: "accent" },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat, 9:00 AM – 7:00 PM IST", color: "success" },
];

const inboundMessages = [
  { id: 1, name: "Megha Joshi", email: "megha.j@example.com", subject: "Partnership inquiry", date: "2026-04-22" },
  { id: 2, name: "Rahul Singh", email: "rahul.s@example.com", subject: "Bulk license pricing", date: "2026-04-21" },
  { id: 3, name: "Pooja Desai", email: "pooja.d@example.com", subject: "Reseller program", date: "2026-04-20" },
];

export default function AdminContacts() {
  return (
    <AdminLayout title="Contact Details" description="Manage business contact info and inbound messages">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {contactBlocks.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg bg-${c.color}/10 flex items-center justify-center mb-3`}>
              <c.icon className={`h-5 w-5 text-${c.color}`} />
            </div>
            <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
            <p className="text-sm font-semibold text-foreground">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4">Recent Inbound Messages</h2>
        <ul className="divide-y divide-border">
          {inboundMessages.map((m) => (
            <li key={m.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-sm">{m.name} <span className="text-muted-foreground font-normal">— {m.email}</span></p>
                <p className="text-xs text-muted-foreground">{m.subject}</p>
              </div>
              <span className="text-xs text-muted-foreground">{m.date}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </AdminLayout>
  );
}
