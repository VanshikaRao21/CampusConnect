import React from 'react';
import NextLink from 'next/link';
import { Sparkles, ShieldCheck, Heart, Cloud, Lock, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#1C334A] bg-[#09111C]/90 backdrop-blur-md text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00D2B4] to-[#009688] flex items-center justify-center text-[#0B1320] shadow-sm font-black">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Campus<span className="text-[#00D2B4]">Connect</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950/80 text-[#00D2B4] border border-teal-500/30">
                AWS Gen 2
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The smart student marketplace for second-hand textbooks, scientific calculators, lab gear, and academic tools. Save money, reduce waste, and connect on campus.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00D2B4]" />
              <span>Zero transaction fees • In-person safe campus pickups</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <NextLink href="/" className="hover:text-[#00D2B4] transition-colors">
                  Explore Marketplace
                </NextLink>
              </li>
              <li>
                <NextLink href="/create-listing" className="hover:text-[#00D2B4] transition-colors">
                  Sell an Academic Item
                </NextLink>
              </li>
              <li>
                <NextLink href="/my-listings" className="hover:text-[#00D2B4] transition-colors">
                  My Active Listings
                </NextLink>
              </li>
              <li>
                <NextLink href="/about" className="hover:text-[#00D2B4] transition-colors">
                  AWS Cloud Architecture
                </NextLink>
              </li>
            </ul>
          </div>

          {/* AWS Cloud Architecture Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Cloud Technology</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#112233]/70 border border-[#1C334A] text-xs text-slate-300">
                <Cloud className="w-3.5 h-3.5 text-[#00D2B4]" />
                <span>AWS Amplify Gen 2 Hosting</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#112233]/70 border border-[#1C334A] text-xs text-slate-300">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Amazon Cognito Auth</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#112233]/70 border border-[#1C334A] text-xs text-slate-300">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>AppSync + DynamoDB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1C334A] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusConnect. College Cloud Application Development Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Designed with <Heart className="w-3 h-3 text-[#00D2B4] fill-current" /> for Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
