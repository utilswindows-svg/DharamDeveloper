import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
import SEO from "@/components/SEO";
  useAppDispatch,
  useAppSelector,
  forgotPassword,
  verifyOtp,
  resetPassword,
  clearAuthError,
  clearAuthMessage,
} from '../store/authStore';

type Step = 'email' | 'otp' | 'reset' | 'done';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => { if (authError) setError(authError); }, [authError]);
  useEffect(() => () => {
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }, [dispatch]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!email || !isValidEmail(email)) { setError('Please enter a valid email'); return; }
    const r = await dispatch(forgotPassword({ email, channel: 'email' }));
    if (forgotPassword.fulfilled.match(r)) {
      setInfo(r.payload?.message || 'OTP sent to your email');
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!otp || otp.length < 4) { setError('Enter the OTP code'); return; }
    const r = await dispatch(verifyOtp({ email, otp, channel: 'email' }));
    if (verifyOtp.fulfilled.match(r)) {
      setInfo('OTP verified. Set your new password.');
      setStep('reset');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    const r = await dispatch(resetPassword({ email, newPassword, channel: 'email' }));
    if (resetPassword.fulfilled.match(r)) setStep('done');
  };

  const handleResend = async () => {
    setError(''); setInfo('');
    const r = await dispatch(forgotPassword({ email, channel: 'email' }));
    if (forgotPassword.fulfilled.match(r)) setInfo('A new code has been sent.');
  };

  const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen">
      <SEO title="Reset Password" description="Reset your WindowsUtils account password securely via email verification." path="/forgot-password" keywords="forgot password, reset password, account recovery" type="website" />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );

  const Alerts = () => (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}
      {info && !error && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{info}</div>
      )}
    </>
  );

  if (step === 'done') {
    return (
      <Card>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h1>
          <p className="text-gray-600 mb-6">You can now sign in with your new password.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-accent hover:opacity-90 text-accent-foreground font-semibold py-2.5 rounded-lg transition-all"
          >
            Back to Sign In
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center mb-8">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {step === 'email' && 'Forgot Password'}
          {step === 'otp' && 'Enter Verification Code'}
          {step === 'reset' && 'Set New Password'}
        </h1>
        <p className="text-gray-600">
          {step === 'email' && 'Enter your email to receive a verification code'}
          {step === 'otp' && `We sent a code to ${email}`}
          {step === 'reset' && 'Choose a strong new password'}
        </p>
      </div>

      <Alerts />

      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 disabled:opacity-50 text-accent-foreground font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin border-2 border-accent-foreground border-t-transparent rounded-full" />
                Sending code...
              </>
            ) : 'Send Verification Code'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg tracking-[0.5em] text-center font-semibold focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 disabled:opacity-50 text-accent-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => setStep('email')} className="text-gray-600 hover:text-gray-800">
              Change email
            </button>
            <button type="button" onClick={handleResend} disabled={loading} className="text-accent hover:opacity-80 font-medium">
              Resend code
            </button>
          </div>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 disabled:opacity-50 text-accent-foreground font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </Card>
  );
};

export default ForgotPassword;