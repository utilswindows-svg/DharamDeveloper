import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, MessageSquare, FileQuestion, BookOpen } from "lucide-react";

const Support = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="hero-gradient py-20">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Support</span>
          <h1 className="mt-3 text-4xl font-extrabold font-heading text-hero-foreground sm:text-5xl">
            We're Here to Help
          </h1>
          <p className="mt-5 max-w-xl text-hero-muted text-lg">
            Get expert assistance for all WindowsUtils products. Our team is dedicated to resolving your queries quickly and effectively.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Mail, title: "Email Support", desc: "Send us your query at support@windowsutils.com and we'll respond within 24 hours.", action: "Send Email" },
            { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support agents in real-time during business hours.", action: "Start Chat" },
            { icon: Phone, title: "Phone Support", desc: "Call us for urgent issues. Available Monday to Friday, 9am to 6pm.", action: "Call Now" },
            { icon: FileQuestion, title: "Submit a Ticket", desc: "Create a detailed support ticket and track its resolution progress.", action: "Create Ticket" },
            { icon: BookOpen, title: "Knowledge Base", desc: "Browse our comprehensive documentation and troubleshooting guides.", action: "Browse Articles" },
            { icon: Clock, title: "Response Time", desc: "We aim to resolve all queries within 24-48 hours, priority support available.", action: "Learn More" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-xl border border-border bg-card p-6 card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              <button className="mt-4 self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90">
                {item.action}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Support;
