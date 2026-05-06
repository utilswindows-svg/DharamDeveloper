import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Clock, MessageSquare, FileQuestion, BookOpen, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Support = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSendEmail = () => {
    window.location.href = 'mailto:support@windowsutils.com';
  };

  const handleStartChat = () => {
    setSelectedOption('chat');
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+91-8750299299';
  };

  const handleCreateTicket = () => {
    setSelectedOption('ticket');
  };

  const handleBrowseArticles = () => {
    window.location.href = '/help';
  };

  const handleLearnMore = () => {
    setSelectedOption('response-time');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Ticket submitted:', formData);
    alert('Support ticket submitted successfully! We will respond within 24-48 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSelectedOption(null);
  };

  const supportOptions = [
    { icon: Mail, title: "Email Support", desc: "Send us your query at support@windowsutils.com and we'll respond within 24 hours.", action: "Send Email", handler: handleSendEmail },
    { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support agents in real-time during business hours.", action: "Start Chat", handler: handleStartChat },
    { icon: Phone, title: "Phone Support", desc: "Call us for urgent issues. Available Monday to Friday, 9am to 6pm.", action: "Call Now", handler: handleCallNow },
    { icon: FileQuestion, title: "Submit a Ticket", desc: "Create a detailed support ticket and track its resolution progress.", action: "Create Ticket", handler: handleCreateTicket },
    { icon: BookOpen, title: "Knowledge Base", desc: "Browse our comprehensive documentation and troubleshooting guides.", action: "Browse Articles", handler: handleBrowseArticles },
    { icon: Clock, title: "Response Time", desc: "We aim to resolve all queries within 24-48 hours, priority support available.", action: "Learn More", handler: handleLearnMore },
  ];

  return (
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
            {supportOptions.map((item, i) => (
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
                <button
                  onClick={item.handler}
                  className="mt-4 self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
                >
                  {item.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {/* Live Chat Modal */}
        {selectedOption === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Live Chat</h2>
                <button
                  onClick={() => setSelectedOption(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-muted-foreground mb-6">
                Our support agents are currently available! They will respond to your messages within a few minutes.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-64 flex items-center justify-center">
                  <p className="text-center text-muted-foreground">Chat window would appear here</p>
                </div>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                />
                <button className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-colors font-medium">
                  Send Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Support Ticket Modal */}
        {selectedOption === 'ticket' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Create Support Ticket</h2>
                <button
                  onClick={() => setSelectedOption(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="Issue with Windows Cleaner"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Describe your issue in detail..."
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOption(null)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Response Time Info Modal */}
        {selectedOption === 'response-time' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Response Time</h2>
                <button
                  onClick={() => setSelectedOption(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-accent mb-2">Standard Support</h3>
                  <p className="text-sm text-muted-foreground">Response time: 24-48 hours</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-accent mb-2">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">Response time: 2-4 hours</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-accent mb-2">Urgent Issues</h3>
                  <p className="text-sm text-muted-foreground">Response time: Same day (by phone)</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  We're committed to resolving your issues quickly. For urgent matters, please call our phone support line.
                </p>
              </div>
              <button
                onClick={() => setSelectedOption(null)}
                className="w-full mt-6 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Support;
