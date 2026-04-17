import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, Download, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout
    console.log('User logged out');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const menuItems = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your account information',
      link: '/profile',
    },
    {
      icon: Download,
      title: 'My Downloads',
      description: 'Access your purchased software',
      link: '/downloads',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'View invoices and payment history',
      link: '/billing',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Account preferences and security',
      link: '/settings',
    },
    {
      icon: Shield,
      title: 'Support',
      description: 'Get help and contact support',
      link: '/support',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-hero text-hero-foreground py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
            <p className="text-xl text-hero-muted max-w-2xl mx-auto">
              Manage your account, access your downloads, and get support all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={item.link}>
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/products"
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <Download className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-semibold">Browse Products</h3>
                  <p className="text-sm text-muted-foreground">Discover new software tools</p>
                </div>
              </Link>
              <Link
                to="/support"
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <Shield className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-semibold">Get Support</h3>
                  <p className="text-sm text-muted-foreground">Need help? We're here for you</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;