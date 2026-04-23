import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, CreditCard, Download, LogOut, Shield, Key, CheckCircle, Clock, ArrowRight } from 'lucide-react';
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
      icon: Key,
      title: 'My Licenses',
      description: 'View license keys and activations',
      link: '/licenses',
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

          {/* Your Licenses Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Key className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Your Licenses</h2>
                  <p className="text-sm text-muted-foreground">Quick overview of your activations</p>
                </div>
              </div>
              <Link
                to="/licenses"
                className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Key className="h-4 w-4" /> Total
                </div>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                  <CheckCircle className="h-4 w-4" /> Active
                </div>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-600 text-sm mb-1">
                  <Clock className="h-4 w-4" /> Trial
                </div>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>

            <Link
              to="/licenses"
              className="block w-full text-center bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Manage Licenses
            </Link>
          </motion.div>

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