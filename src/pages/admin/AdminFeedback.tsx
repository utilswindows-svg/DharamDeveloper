import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Feedback {
  id: number;
  user: string;
  email: string;
  product: string;
  rating: number;
  message: string;
  date: string;
}

const feedbacks: Feedback[] = [
  { id: 1, user: "Rohit Sharma", email: "rohit@example.com", product: "Windows Cleaner Pro", rating: 5, message: "Excellent product! Cleaned up 12GB of junk files. Highly recommended.", date: "2026-04-22" },
  { id: 2, user: "Anita Verma", email: "anita.v@example.com", product: "Password Manager", rating: 4, message: "Works great, but I'd love a browser extension for Firefox.", date: "2026-04-21" },
  { id: 3, user: "Karan Mehta", email: "karan.m@example.com", product: "System Optimizer", rating: 5, message: "Boot time improved by 40%. Worth every rupee.", date: "2026-04-20" },
  { id: 4, user: "Sneha Iyer", email: "sneha.i@example.com", product: "Data Recovery", rating: 3, message: "Recovered most files but not the ones I needed most. Mixed feelings.", date: "2026-04-18" },
];

const Stars = ({ n }: { n: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`h-4 w-4 ${i <= n ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

export default function AdminFeedback() {
  return (
    <AdminLayout title="Feedback" description="User reviews and product feedback">
      <div className="grid md:grid-cols-2 gap-4">
        {feedbacks.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {f.user.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.user}</p>
                  <p className="text-xs text-muted-foreground">{f.email}</p>
                </div>
              </div>
              <Stars n={f.rating} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">{f.product}</span> · {f.date}
            </p>
            <p className="text-sm text-foreground flex gap-2">
              <MessageSquare className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              {f.message}
            </p>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
