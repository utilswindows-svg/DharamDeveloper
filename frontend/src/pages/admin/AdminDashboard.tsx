import { motion } from "framer-motion";
import { Users, Key, Download, Ticket, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const stats = [
  { label: "Total Users", value: "1,284", icon: Users, color: "primary", link: "/admin/users" },
  { label: "Active Licenses", value: "842", icon: Key, color: "accent", link: "/admin/licenses" },
  { label: "Total Downloads", value: "5,621", icon: Download, color: "success", link: "/admin/downloads" },
  { label: "Open Tickets", value: "23", icon: Ticket, color: "destructive", link: "/admin/tickets" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" description="Overview of your platform metrics and activity">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={stat.link}
              className="block bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <ul className="space-y-3 text-sm">
            {[
              "New user registered: rohit@example.com",
              "License KEY-9F4A activated by Anita Verma",
              "New ticket #1284 — Installation issue",
              "Feedback received from Karan Mehta",
              "Free download: WindowsCleanerPro-v2.5.1.exe",
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-2 pb-3 border-b border-border last:border-0">
                <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                <span className="text-muted-foreground">{line}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <Link
                key={s.label}
                to={s.link}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{s.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
