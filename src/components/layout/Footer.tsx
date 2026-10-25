import React from 'react';
import NextLink from 'next/link';
import { Sparkles, ShieldCheck, Heart, Cloud, Lock, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Campus<span className="text-blue-600">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              The smart student marketplace for second-hand textbooks, scientific calculators, lab gear, and academic tools. Save money, reduce waste, and connect on campus.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero transaction fees • In-person safe campus pickups</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <NextLink href="/" className="hover:text-blue-600 transition-colors">
                  Explore Marketplace
                </NextLink>
              </li>
              <li>
                <NextLink href="/create-listing" className="hover:text-blue-600 transition-colors">
                  Sell an Academic Item
                </NextLink>
              </li>
              <li>
                <NextLink href="/my-listings" className="hover:text-blue-600 transition-colors">
                  My Active Listings
                </NextLink>
              </li>
              <li>
                <NextLink href="/about" className="hover:text-blue-600 transition-colors">
                  AWS Cloud Architecture
                </NextLink>
              </li>
            </ul>
          </div>

          {/* AWS Cloud Architecture Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Cloud Technology</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                <span>AWS Amplify Gen 2 Hosting</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <Lock className="w-3.5 h-3.5 text-violet-600" />
                <span>Amazon Cognito Auth</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>AppSync + DynamoDB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusConnect. College Cloud Application Development Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              Designed with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
