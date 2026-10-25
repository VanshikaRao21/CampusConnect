import React from 'react';
import { Camera, Users, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'List in 60 Seconds',
      description: 'Snap a picture of your textbook, calculator, or drafter. Set your fair student price in ₹ and submit.',
      icon: Camera,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      step: '02',
      title: 'Direct Campus Match',
      description: 'Verified students discover your listing. They reach out directly via college email or WhatsApp.',
      icon: Users,
      color: 'bg-violet-100 text-violet-600',
    },
    {
      step: '03',
      title: 'In-Person Handover',
      description: 'Inspect the item together at the college library, canteen, or campus foyer. Pay cash/UPI on the spot.',
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <section className="mt-20 py-12 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white relative overflow-hidden shadow-xl">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Seamless Peer-to-Peer Workflow
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
          How CampusConnect Works
        </h2>
        <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto">
          No shipping waiting times. No platform cuts. Just pure student-to-student sharing on campus.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
