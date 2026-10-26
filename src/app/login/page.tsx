'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Database, 
  Cloud, 
  BookOpen, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { authClient } from '../../lib/amplifyClient';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-redirect if already authenticated
  useEffect(() => {
    const user = authClient.getCurrentUser();
    if (user.isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please enter both your college email and password.');
      }
      const user = await authClient.signIn(email.trim(), password);
      setSuccessMessage(`Welcome back, ${user.email}! Redirecting to Marketplace...`);
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in via Amazon Cognito.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please provide email and password.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      if (password.length < 8) {
        throw new Error('Cognito security policy requires password to be at least 8 characters.');
      }
      const res = await authClient.signUp(email.trim(), password);
      if (res.isSignUpComplete) {
        setSuccessMessage('Account created and verified! Redirecting to Marketplace...');
        setTimeout(() => router.push('/'), 1000);
      } else {
        setNeedsVerification(true);
        setSuccessMessage('Verification code sent to your email. Enter the code below.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (!code.trim()) throw new Error('Please enter the confirmation code.');
      await authClient.confirmSignUp(email.trim(), code.trim());
      setSuccessMessage('Email verified successfully! Logging you in...');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOneClickDemoLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const demoUser = await authClient.signIn('student@college.edu', 'CampusConnect2026!');
      setSuccessMessage(`Logged in as ${demoUser.email}! Redirecting to Marketplace...`);
      setTimeout(() => router.push('/'), 800);
    } catch (err: any) {
      setError('One-click demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Landing Hero & AWS Architecture Pitch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>The AWS Cloud Student Exchange Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Exchange Books, Calculators & Lab Gear with <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Campus Peers.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            CampusConnect is an end-to-end college marketplace powered by <strong className="text-slate-900 dark:text-white font-semibold">AWS Amplify Gen 2</strong>. Buy and sell verified second-hand academic supplies directly with batchmates at zero commission.
          </p>

          {/* 3 AWS Architectural Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Amazon Cognito</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Encrypted JWT session tokens & campus email authentication.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AWS AppSync</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Managed GraphQL API with real-time Amazon DynamoDB sync.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Amazon S3</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                High-availability bucket storage for uploaded listing photos.
              </p>
            </div>
          </div>

          {/* Quick link to Architecture Documentation */}
          <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Want to see system design?</span>
            <NextLink href="/about" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Inspect Cloud Architecture Diagram <ExternalLink className="w-3.5 h-3.5" />
            </NextLink>
          </div>
        </div>

        {/* Right Column: Interactive Cognito Auth Card */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Subtle top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>

            {/* Header with AWS Cognito Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Student Portal</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sign in to list items & manage trade chats</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/80 border border-violet-200 dark:border-violet-800 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                <Lock className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                <span>Cognito Auth</span>
              </div>
            </div>

            {/* 1-Click Fast Demo Login for Teachers & Evaluators */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-blue-200/80 dark:border-indigo-800/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Fast Evaluator Login</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    1-click simulated college credential (<code className="text-blue-700 dark:text-blue-300 font-mono">student@college.edu</code>).
                  </p>
                  <button
                    onClick={handleOneClickDemoLogin}
                    disabled={isSubmitting}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Instant 1-Click Student Sign-In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Success Notification */}
            {successMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-xs font-medium text-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Standard Sign In / Sign Up Form */}
            {!needsVerification ? (
              <div className="mt-6">
                {/* Tabs */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-5 text-xs font-bold">
                  <button
                    onClick={() => { setActiveTab('signin'); setError(null); }}
                    className={`py-2 rounded-lg transition-all ${
                      activeTab === 'signin'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setActiveTab('signup'); setError(null); }}
                    className={`py-2 rounded-lg transition-all ${
                      activeTab === 'signup'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      College Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@college.edu"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{activeTab === 'signin' ? 'Sign In with Cognito' : 'Register with College ID'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Verification Code Step */
              <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  Enter the 6-digit confirmation code generated by Amazon Cognito.
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Confirmation Code
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center tracking-widest text-lg font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all"
                >
                  Verify & Enter Marketplace
                </button>
              </form>
            )}

            {/* Guest Continue Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <NextLink
                href="/"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Skip to Marketplace as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
