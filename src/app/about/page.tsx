import React from 'react';
import NextLink from 'next/link';
import { 
  Cloud, 
  Database, 
  Lock, 
  HardDrive, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Server,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const awsServices = [
    {
      name: 'AWS Amplify Gen 2',
      role: 'Unified Cloud Backend & Hosting',
      description: 'Provides code-first backend resource definitions, automated CI/CD deployment, and client library integration connecting Next.js with cloud infrastructure.',
      icon: Cloud,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      name: 'Amazon Cognito',
      role: 'Identity & Authentication',
      description: 'Manages student user pools, secure email verification, session tokens (JWT), and owner-based authorization so only listing creators can modify their own items.',
      icon: Lock,
      color: 'bg-violet-100 text-violet-700 border-violet-200',
    },
    {
      name: 'AWS AppSync (GraphQL)',
      role: 'Serverless Managed API Layer',
      description: 'Acts as the high-speed GraphQL interface between the client and database. Handles schema validation, queries, mutations, and real-time subscriptions.',
      icon: Zap,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      name: 'Amazon DynamoDB',
      role: 'NoSQL Cloud Data Store',
      description: 'Stores all structured marketplace listing records (titles, descriptions, categories, prices in ₹, condition tags, timestamps, and owner IDs) with sub-millisecond latency.',
      icon: Database,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      name: 'Amazon S3 (Simple Storage Service)',
      role: 'Cloud Object Storage',
      description: 'Stores uploaded product photos in an S3 bucket configured via Amplify Storage. Enforces least-privilege upload policies and global CDN read access for student images.',
      icon: HardDrive,
      color: 'bg-rose-100 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>College Cloud Application Development Project</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Cloud Architecture & System Design
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          How CampusConnect leverages modern serverless AWS infrastructure to deliver a scalable, secure, and lightning-fast peer-to-peer student marketplace.
        </p>
      </div>

      {/* Interactive / Visual Cloud Architecture Diagram */}
      <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              End-to-End AWS Topology
            </span>
            <h3 className="text-lg font-bold text-white">System Architecture & Data Flow</h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
            Amplify Gen 2 Architecture
          </span>
        </div>

        {/* Authored SVG Architecture Diagram */}
        <div className="w-full overflow-x-auto py-4">
          <svg
            viewBox="0 0 900 360"
            className="w-full min-w-[700px] h-auto text-slate-200 font-sans"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background grids & bounding boxes */}
            <rect x="10" y="20" width="160" height="300" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="230" y="20" width="180" height="300" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="470" y="20" width="180" height="300" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="710" y="20" width="180" height="300" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />

            {/* Column Headers */}
            <text x="90" y="50" fill="#94A3B8" fontSize="12" fontWeight="700" textAnchor="middle">1. CLIENT LAYER</text>
            <text x="320" y="50" fill="#94A3B8" fontSize="12" fontWeight="700" textAnchor="middle">2. AUTH & HOSTING</text>
            <text x="560" y="50" fill="#94A3B8" fontSize="12" fontWeight="700" textAnchor="middle">3. API & STORAGE</text>
            <text x="800" y="50" fill="#94A3B8" fontSize="12" fontWeight="700" textAnchor="middle">4. DATA PERSISTENCE</text>

            {/* Node 1: Browser / Student */}
            <rect x="30" y="90" width="120" height="70" rx="10" fill="#2563EB" />
            <text x="90" y="125" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle">Student Browser</text>
            <text x="90" y="142" fill="#DBEAFE" fontSize="10" textAnchor="middle">Next.js 14 App</text>

            {/* Node 2: Mobile / Tablet */}
            <rect x="30" y="190" width="120" height="70" rx="10" fill="#3B82F6" opacity="0.8" />
            <text x="90" y="225" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle">Mobile Client</text>
            <text x="90" y="242" fill="#DBEAFE" fontSize="10" textAnchor="middle">Responsive PWA</text>

            {/* Node 3: Amplify Hosting */}
            <rect x="250" y="90" width="140" height="70" rx="10" fill="#0284C7" />
            <text x="320" y="125" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">AWS Amplify Hosting</text>
            <text x="320" y="142" fill="#BAE6FD" fontSize="10" textAnchor="middle">Global CloudFront CDN</text>

            {/* Node 4: Amazon Cognito */}
            <rect x="250" y="190" width="140" height="70" rx="10" fill="#7C3AED" />
            <text x="320" y="225" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">Amazon Cognito</text>
            <text x="320" y="242" fill="#DDD6FE" fontSize="10" textAnchor="middle">JWT User Pool & RBAC</text>

            {/* Node 5: AppSync */}
            <rect x="490" y="90" width="140" height="70" rx="10" fill="#D97706" />
            <text x="560" y="125" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">AWS AppSync</text>
            <text x="560" y="142" fill="#FDE68A" fontSize="10" textAnchor="middle">Managed GraphQL API</text>

            {/* Node 6: Amazon S3 */}
            <rect x="490" y="190" width="140" height="70" rx="10" fill="#E11D48" />
            <text x="560" y="225" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">Amazon S3</text>
            <text x="560" y="242" fill="#FECDD3" fontSize="10" textAnchor="middle">Product Photos Storage</text>

            {/* Node 7: Amazon DynamoDB */}
            <rect x="730" y="90" width="140" height="70" rx="10" fill="#059669" />
            <text x="800" y="125" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">Amazon DynamoDB</text>
            <text x="800" y="142" fill="#A7F3D0" fontSize="10" textAnchor="middle">Listings Fact Table</text>

            {/* Connector Lines & Arrows */}
            {/* 1 -> Hosting */}
            <path d="M150 125 L250 125" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 4" />
            {/* 1 -> Cognito */}
            <path d="M150 135 L200 135 L200 225 L250 225" stroke="#A78BFA" strokeWidth="2" />
            {/* Hosting -> AppSync */}
            <path d="M390 125 L490 125" stroke="#FBBF24" strokeWidth="2" />
            {/* Cognito -> AppSync (auth header) */}
            <path d="M390 225 L440 225 L440 145 L490 145" stroke="#A78BFA" strokeWidth="2" strokeDasharray="2 2" />
            {/* Client direct upload -> S3 */}
            <path d="M150 225 L490 225" stroke="#FB7185" strokeWidth="2" strokeDasharray="3 3" />
            {/* AppSync -> DynamoDB */}
            <path d="M630 125 L730 125" stroke="#34D399" strokeWidth="3" />
          </svg>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Solid lines indicate real-time data transactions. Dashed lines indicate authentication and direct S3 image uploads.</span>
          <span className="text-emerald-400 font-mono">100% Serverless Architecture</span>
        </div>
      </div>

      {/* AWS Services Breakdown */}
      <div className="mb-14">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          AWS Cloud Building Blocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awsServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${svc.color} border flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{svc.name}</h3>
                  <span className="text-xs font-semibold text-blue-600 block mb-2">{svc.role}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{svc.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Access Control */}
      <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/80 mb-12">
        <div className="flex items-center gap-2.5 text-blue-800 font-bold text-sm uppercase tracking-wider mb-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>AWS Security & Least-Privilege Policies</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-4">
          Enterprise Security Standards in an Academic App
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1">
            <strong className="text-slate-900 block font-bold">Amazon Cognito Owner Authorization:</strong>
            Listings can only be edited or deleted by the student who created them. Ownership is verified via Cognito JWT claims at the AppSync resolver level, preventing IDOR vulnerabilities.
          </div>
          <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1">
            <strong className="text-slate-900 block font-bold">Amazon S3 Scoped Storage:</strong>
            Media uploads are restricted to JPEG, PNG, and WebP formats under 5MB. Files are scoped under individual student identity paths with public read permissions for marketplace rendering.
          </div>
          <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1">
            <strong className="text-slate-900 block font-bold">Zero Credential Exposure:</strong>
            No AWS root keys or IAM credentials exist in frontend code. Access is brokered securely via Cognito identity pools and short-lived STS tokens.
          </div>
          <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-1">
            <strong className="text-slate-900 block font-bold">Schema-Enforced Input Validation:</strong>
            DynamoDB reject negative prices or unsupported categories via AppSync GraphQL type constraints and client-side pre-flight validations.
          </div>
        </div>
      </div>

    </div>
  );
}
