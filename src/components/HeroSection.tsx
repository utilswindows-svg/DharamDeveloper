import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, HardDrive, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { api } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

const categories = [
  { icon: HardDrive, label: "Data Recovery", color: "bg-primary" },
  { icon: FileText, label: "PDF Tools", color: "accent-gradient" },
  { icon: Zap, label: "Email Migration", color: "bg-success" },
  { icon: Shield, label: "PC Optimizer", color: "bg-teal" },
];

const HeroSection = () => {
  const [feedbackForm, setFeedbackForm] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = feedbackForm;
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/feedback", { name, email, message });
      toast({ title: data?.message || "Feedback submitted. Thank you!" });
      setSubmitted(true);
      setFeedbackForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      toast({
        title: "Failed to submit feedback",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>

      <div className="relative section-container py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Side Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl font-extrabold leading-tight text-hero-foreground font-heading sm:text-5xl lg:text-6xl">
                Your Trusted
                <br />
                <span className="text-accent">Windows Utility</span>
                <br />
                Toolkit
              </h1>
              <p className="mt-5 max-w-lg text-lg text-hero-muted">
                Professional-grade tools for data recovery, email migration, PDF management, and PC optimization. Trusted by 1M+ users worldwide.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/support" className="accent-gradient inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 hover:shadow-xl">
                  Explore Tools <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/help" className="inline-flex items-center gap-2 rounded-lg border border-hero-muted/30 bg-hero-foreground/5 px-6 py-3 text-sm font-semibold text-hero-foreground backdrop-blur-sm transition-all hover:bg-hero-foreground/10">
                  Help Center
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-14 flex flex-wrap gap-12"
            >
              {[
                { value: "50+", label: "Utility Tools" },
                { value: "1M+", label: "Happy Users" },
                { value: "10+", label: "Years Experience" },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-accent font-heading">{stat.value}</p>
                  <p className="text-sm text-hero-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {categories.map(cat => (
                <div key={cat.label} className={`flex items-center gap-3 rounded-xl ${cat.color} px-5 py-4 text-primary-foreground`}>
                  <cat.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-semibold">{cat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-start justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white/95 p-6 shadow-lg backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Send Feedback</h3>
              {submitted ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mb-2 text-2xl">✓</div>
                    <p className="text-sm text-green-600 font-semibold">Thank you for your feedback!</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={feedbackForm.name}
                      onChange={handleFeedbackChange}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-accent focus:bg-white focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={feedbackForm.email}
                      onChange={handleFeedbackChange}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-accent focus:bg-white focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      name="message"
                      value={feedbackForm.message}
                      onChange={handleFeedbackChange}
                      required
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-accent focus:bg-white focus:outline-none resize-none"
                      placeholder="Your feedback..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 hover:shadow-md"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
