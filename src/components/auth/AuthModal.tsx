'use client';

import { FormEvent, useState } from 'react';
import { authClient } from '../../lib/amplifyClient';

function XIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function MailIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockKeyholeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="16" r="1" /><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

type AuthMode = 'signin' | 'signup' | 'verify';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') {
        const result = await authClient.signUp(email, password);
        if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') setMode('verify');
        else { await authClient.restoreSession(); onClose(); }
      } else if (mode === 'verify') {
        await authClient.confirmSignUp(email, code);
        setMode('signin');
      } else {
        const result = await authClient.signIn(email, password);
        if (result.isSignedIn) onClose();
        else setError('Complete the additional verification step to continue.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed. Please try again.');
    } finally { setBusy(false); }
  };

  const title = mode === 'signup' ? 'Create your student account' : mode === 'verify' ? 'Verify your email' : 'Welcome back';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="mb-3 inline-flex rounded-xl bg-blue-50 p-2 text-blue-700">
              <ShieldCheckIcon className="h-5 w-5" />
            </span>
            <h2 id="auth-title" className="text-2xl font-black text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">Secure sign-in powered by Amazon Cognito.</p>
          </div>
          <button onClick={onClose} aria-label="Close sign-in" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Student email
            <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <MailIcon className="h-4 w-4 text-slate-400" />
              <input autoComplete="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm outline-none" placeholder="you@college.edu" />
            </div>
          </label>
          {mode !== 'verify' && (
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                <LockKeyholeIcon className="h-4 w-4 text-slate-400" />
                <input autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent px-3 py-3 text-sm outline-none" placeholder="At least 8 characters" />
              </div>
            </label>
          )}
          {mode === 'verify' && (
            <label className="block text-sm font-semibold text-slate-700">
              Verification code
              <input required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500" placeholder="Enter the code sent to your email" />
            </label>
          )}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'verify' ? 'Verify email' : 'Sign in'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === 'verify' ? 'Already verified? ' : mode === 'signup' ? 'Already have an account? ' : 'New to CampusConnect? '}
          <button onClick={() => { setError(''); setMode(mode === 'signup' || mode === 'verify' ? 'signin' : 'signup'); }} className="font-bold text-blue-700">
            {mode === 'signup' || mode === 'verify' ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </section>
    </div>
  );
}
