'use client';

import React, { useState } from 'react';
import { Database, RotateCcw, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface DemoControlBarProps {
  onResetSeed: () => Promise<void>;
  count: number;
}

export default function DemoControlBar({ onResetSeed, count }: DemoControlBarProps) {
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    try {
      setResetting(true);
      await onResetSeed();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-violet-50 to-slate-50 border border-blue-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          AWS AppSync + DynamoDB:
        </span>
        <span className="text-slate-600 font-medium">
          <strong className="text-blue-700">{count}</strong> persistent listing records loaded
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          disabled={resetting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors shadow-2xs disabled:opacity-50"
          title="Reset database to default sample academic listings"
        >
          {success ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Database Reset!</span>
            </>
          ) : (
            <>
              <RotateCcw className={`w-3.5 h-3.5 text-blue-600 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Demo Seed Data'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
