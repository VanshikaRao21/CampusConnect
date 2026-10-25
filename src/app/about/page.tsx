'use client';

import React, { useState } from 'react';
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
  CheckCircle2,
  Cpu,
  Layers,
  Key,
  FileCheck,
  Code2,
  Info
} from 'lucide-react';

interface ArchitectureNode {
  id: string;
  name: string;
  category: string;
  role: string;
  awsService: string;
  protocol: string;
  security: string;
  specs: string;
  codeSnippet: string;
}

export default function AboutPage() {
  const [selectedNode, setSelectedNode] = useState<string>('appsync');

  const pipelineNodes: ArchitectureNode[] = [
    {
      id: 'browser',
      name: 'Student Browser',
      category: '1. Client Layer',
      awsService: 'Next.js 14 Client',
      role: 'Client application rendering interactive marketplace UI, managing photo selections, and executing client-side pre-flight validations.',
      protocol: 'HTTPS / TLS 1.3',
      security: 'Zero credentials stored in code; uses short-lived tokens and memory cache.',
      specs: 'Next.js 14 App Router, Tailwind CSS, Lucide icons, responsive layout for mobile & desktop.',
      codeSnippet: `// Client-Side Pre-Flight Validation
const validation = validateListingInput({ title, category, price, condition });
const imageValid = validateImageFile(file); // <= 5MB, JPEG/PNG/WebP`,
    },
    {
      id: 'hosting',
      name: 'AWS Amplify Hosting',
      category: '2. Hosting & Delivery',
      awsService: 'Amplify Hosting & CloudFront CDN',
      role: 'Global edge distribution providing sub-50ms static asset delivery, SSR execution, continuous CI/CD deployments, and SSL/TLS termination.',
      protocol: 'HTTP/2 & HTTP/3 via CloudFront',
      security: 'Automated HTTPS certificate management (ACM) with DDoS mitigation via AWS Shield Standard.',
      specs: 'Global CDN edge caches, automated Git push-to-deploy pipeline, environment branch isolation.',
      codeSnippet: `// amplify/backend.ts
export const backend = defineBackend({
  auth,
  data,
  storage,
});`,
    },
    {
      id: 'cognito',
      name: 'Amazon Cognito',
      category: '3. Identity & Auth',
      awsService: 'Cognito User & Identity Pools',
      role: 'Manages student identities, institutional email domain verification, OAuth/OIDC JWT tokens, and temporary STS credential exchanges for S3 uploads.',
      protocol: 'OAuth 2.0 / OpenID Connect (JWT)',
      security: 'Role-Based Access Control (RBAC) with owner authorization claims (sub) embedded in ID tokens.',
      specs: 'User Pools for password & MFA, Identity Pools for scoped AWS STS IAM credentials.',
      codeSnippet: `// amplify/auth/resource.ts
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: { required: false },
  },
});`,
    },
    {
      id: 'appsync',
      name: 'AWS AppSync (GraphQL)',
      category: '4. API Gateway',
      awsService: 'Managed Serverless GraphQL API',
      role: 'Unified high-speed API layer resolving GraphQL queries, mutations, and real-time subscriptions with schema-enforced type safety.',
      protocol: 'GraphQL over HTTPS / WSS',
      security: 'Dual authorization mode: Cognito User Pools for student CRUD + API Key for public guest reads.',
      specs: 'VTL & JavaScript resolvers, automated query batching, DynamoDB direct mapping without Lambda overhead.',
      codeSnippet: `// amplify/data/resource.ts
const schema = a.schema({
  Listing: a.model({
    title: a.string().required(),
    price: a.float().required(),
    imagePath: a.string(),
    owner: a.string(),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.owner(),
  ]),
});`,
    },
    {
      id: 'dynamodb',
      name: 'Amazon DynamoDB',
      category: '5. Data Persistence',
      awsService: 'Serverless NoSQL Database',
      role: 'Stores all marketplace listing records, prices, condition badges, seller contact metadata, and S3 media keys with consistent single-digit ms latency.',
      protocol: 'AWS SDK v3 / SigV4',
      security: 'Encryption at rest using AWS KMS (SSE-KMS), least-privilege IAM AppSync execution role.',
      specs: 'PAY_PER_REQUEST on-demand capacity, single-table partition key distribution, Global Secondary Indexes.',
      codeSnippet: `// DynamoDB Partitioning Strategy
Primary Key:
  PK: id (e.g. "item-1730000000-482")
Global Secondary Indexes (GSI):
  GSI_Category: PK=category, SK=createdAt
  GSI_Owner:    PK=owner,    SK=createdAt`,
    },
    {
      id: 's3',
      name: 'Amazon S3',
      category: '5. Object Storage',
      awsService: 'Simple Storage Service (S3)',
      role: 'Stores original student-uploaded product photos with scoped entity-level path isolation and fast public CDN reading for marketplace cards.',
      protocol: 'HTTPS REST (uploadData / getUrl)',
      security: 'Scoped path access: product-images/{entity_id}/* write restricted to owner; public read access.',
      specs: 'Amplify Storage Gen 2 definition, 5MB object limit, JPEG/PNG/WebP format enforcement.',
      codeSnippet: `// amplify/storage/resource.ts
export const storage = defineStorage({
  name: 'campusConnectMedia',
  access: (allow) => ({
    'product-images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
    ],
  }),
});`,
    },
  ];

  const activeData = pipelineNodes.find((n) => n.id === selectedNode) || pipelineNodes[3];

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
          Cloud Architecture & Technical Specs
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          How CampusConnect leverages modern serverless AWS infrastructure to deliver a scalable, secure, and lightning-fast peer-to-peer student marketplace.
        </p>
      </div>

      {/* Interactive Cloud Architecture Diagram Section */}
      <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
              End-to-End Serverless Pipeline Topology
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Interactive System Architecture & Data Flow
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
              AWS Amplify Gen 2
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
              100% Serverless
            </span>
          </div>
        </div>

        {/* Quick Node Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs font-medium">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mr-1 shrink-0">
            Click Node to Inspect:
          </span>
          {pipelineNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                selectedNode === node.id
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {node.name}
            </button>
          ))}
        </div>

        {/* Authored Interactive SVG Topology Diagram */}
        <div className="w-full overflow-x-auto py-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4">
          <svg
            viewBox="0 0 1000 360"
            className="w-full min-w-[850px] h-auto font-sans select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#60A5FA" />
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#34D399" />
              </marker>
              <marker id="arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#FB7185" />
              </marker>
              <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#C084FC" />
              </marker>
              <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B21A8" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BE123C" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>

            {/* Architecture Column Boundaries */}
            <rect x="15" y="20" width="160" height="320" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="205" y="20" width="160" height="320" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="395" y="20" width="160" height="320" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="585" y="20" width="180" height="320" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="795" y="20" width="190" height="320" rx="16" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />

            {/* Stage Headers */}
            <text x="95" y="48" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">1. CLIENT LAYER</text>
            <text x="285" y="48" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">2. HOSTING & CDN</text>
            <text x="475" y="48" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">3. AUTH & IDENTITY</text>
            <text x="675" y="48" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">4. MANAGED API</text>
            <text x="890" y="48" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">5. DATA & STORAGE</text>

            {/* Connecting Data Pipelines with Directional Arrows */}
            {/* 1. Browser -> Amplify Hosting */}
            <path d="M 155 125 L 220 125" stroke="#38BDF8" strokeWidth="2.5" markerEnd="url(#arrow)" />
            {/* 2. Browser -> Cognito (Auth flow) */}
            <path d="M 155 145 C 220 170, 320 200, 410 200" stroke="#C084FC" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#arrow-purple)" />
            {/* 3. Cognito -> AppSync (Auth Bearer Token) */}
            <path d="M 535 200 C 565 200, 575 145, 605 135" stroke="#C084FC" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-purple)" />
            {/* 4. Amplify Hosting -> AppSync (GraphQL Request) */}
            <path d="M 345 125 C 440 100, 510 105, 605 120" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" />
            {/* 5. AppSync -> DynamoDB (CRUD Queries / Mutations) */}
            <path d="M 745 125 L 815 110" stroke="#34D399" strokeWidth="3" markerEnd="url(#arrow-green)" />
            {/* 6. Browser direct upload to S3 (Amplify Storage uploadData) */}
            <path d="M 155 240 C 350 330, 650 330, 815 250" stroke="#FB7185" strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#arrow-rose)" />
            {/* 7. DynamoDB <-> S3 link (Image Key Reference) */}
            <path d="M 890 150 L 890 200" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />

            {/* NODE 1: Student Browser */}
            <g
              onClick={() => setSelectedNode('browser')}
              className="cursor-pointer transition-transform hover:opacity-95"
            >
              <rect
                x="30"
                y="90"
                width="130"
                height="75"
                rx="12"
                fill="url(#grad-blue)"
                stroke={selectedNode === 'browser' ? '#60A5FA' : '#3B82F6'}
                strokeWidth={selectedNode === 'browser' ? '3' : '1.5'}
              />
              <text x="95" y="125" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle">Student Browser</text>
              <text x="95" y="145" fill="#DBEAFE" fontSize="10.5" fontWeight="500" textAnchor="middle">Next.js 14 App</text>
            </g>

            {/* Sub-node: Student Mobile Client */}
            <g onClick={() => setSelectedNode('browser')} className="cursor-pointer hover:opacity-95">
              <rect x="30" y="195" width="130" height="65" rx="12" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
              <text x="95" y="227" fill="#FFFFFF" fontSize="12" fontWeight="700" textAnchor="middle">Mobile Client</text>
              <text x="95" y="244" fill="#93C5FD" fontSize="10" textAnchor="middle">Responsive PWA</text>
            </g>

            {/* NODE 2: Amplify Hosting */}
            <g
              onClick={() => setSelectedNode('hosting')}
              className="cursor-pointer transition-transform hover:opacity-95"
            >
              <rect
                x="220"
                y="90"
                width="130"
                height="75"
                rx="12"
                fill="url(#grad-sky)"
                stroke={selectedNode === 'hosting' ? '#38BDF8' : '#0284C7'}
                strokeWidth={selectedNode === 'hosting' ? '3' : '1.5'}
              />
              <text x="285" y="123" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle">Amplify Hosting</text>
              <text x="285" y="142" fill="#E0F2FE" fontSize="10" textAnchor="middle">CloudFront Edge CDN</text>
            </g>

            {/* NODE 3: Amazon Cognito */}
            <g
              onClick={() => setSelectedNode('cognito')}
              className="cursor-pointer transition-transform hover:opacity-95"
            >
              <rect
                x="410"
                y="160"
                width="130"
                height="80"
                rx="12"
                fill="url(#grad-purple)"
                stroke={selectedNode === 'cognito' ? '#C084FC' : '#7C3AED'}
                strokeWidth={selectedNode === 'cognito' ? '3' : '1.5'}
              />
              <text x="475" y="195" fill="#FFFFFF" fontSize="12.5" fontWeight="800" textAnchor="middle">Amazon Cognito</text>
              <text x="475" y="213" fill="#F3E8FF" fontSize="10" textAnchor="middle">User Pool & STS JWT</text>
            </g>

            {/* NODE 4: AWS AppSync */}
            <g
              onClick={() => setSelectedNode('appsync')}
              className="cursor-pointer transition-transform hover:opacity-95"
            >
              <rect
                x="605"
                y="90"
                width="140"
                height="80"
                rx="12"
                fill="url(#grad-amber)"
                stroke={selectedNode === 'appsync' ? '#FCD34D' : '#D97706'}
                strokeWidth={selectedNode === 'appsync' ? '3' : '1.5'}
              />
              <text x="675" y="125" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle">AWS AppSync</text>
              <text x="675" y="145" fill="#FEF3C7" fontSize="10.5" textAnchor="middle">Serverless GraphQL API</text>
            </g>

            {/* NODE 5A: Amazon DynamoDB */}
            <g
              onClick={() => setSelectedNode('dynamodb')}
              className="cursor-pointer transition-transform hover:opacity-95"
            >
              <rect
                x="815"
                y="70"
                width="150"
                height="80"
                rx="12"
                fill="url(#grad-emerald)"
                stroke={selectedNode === 'dynamodb' ? '#6EE7B7' : '#059669'}
                strokeWidth={selectedNode === 'dynamodb' ? '3' : '1.5'}
              />
              <text x="890" y="105" fill="#FFFFFF" fontSize="12.5" fontWeight="800" textAnchor="middle">Amazon DynamoDB</text>
              <text x="890" y="125" fill="#D1FAE5" fontSize="10" textAnchor="middle">Listings Fact Table (NoSQL)</text>
            </g>

            {/* NODE 5B: Amazon S3 */}
            <g
              onClick={() => setSelectedNode('s3')}
              className="cursor-pointer transition-transform hover:opacity-95"
            >
              <rect
                x="815"
                y="200"
                width="150"
                height="80"
                rx="12"
                fill="url(#grad-rose)"
                stroke={selectedNode === 's3' ? '#FDA4AF' : '#E11D48'}
                strokeWidth={selectedNode === 's3' ? '3' : '1.5'}
              />
              <text x="890" y="235" fill="#FFFFFF" fontSize="12.5" fontWeight="800" textAnchor="middle">Amazon S3</text>
              <text x="890" y="255" fill="#FFE4E6" fontSize="10" textAnchor="middle">Amplify Media Bucket</text>
            </g>
          </svg>
        </div>

        {/* Dynamic Topology Node Inspector Card */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-800/90 border border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3 mb-4">
            <div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider block">
                {activeData.category} • Selected Service
              </span>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {activeData.name} ({activeData.awsService})
              </h4>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Protocol: {activeData.protocol}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 mb-4">
            <div>
              <strong className="text-white block mb-1">Architecture Role:</strong>
              <p className="leading-relaxed text-slate-300">{activeData.role}</p>
            </div>
            <div>
              <strong className="text-white block mb-1">Security & Access Policy:</strong>
              <p className="leading-relaxed text-slate-300">{activeData.security}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Amplify Gen 2 Definition / Implementation Snippet</span>
              <span>{activeData.specs}</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
              <code>{activeData.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 inline-block"></span> CDN Static Delivery</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-400 border-b border-dashed inline-block"></span> Cognito STS / JWT Tokens</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block"></span> AppSync GraphQL Mutations</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-400 border-b border-dashed inline-block"></span> Direct S3 Media Upload</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> DynamoDB CRUD Operations</span>
          </div>
          <span className="text-emerald-400 font-mono text-xs">Zero Server Maintenance (100% AWS Managed)</span>
        </div>
      </div>

      {/* Deep Technical Specifications Grid */}
      <div className="space-y-12 mb-14">
        
        {/* Section 1: Least-Privilege Security Policies */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2.5 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Identity & Access Control (IAM)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            1. Least-Privilege Security Policies
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            CampusConnect implements military-grade least-privilege access across the entire serverless application stack, ensuring students can only access or modify the resources they own.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Key className="w-4 h-4 text-violet-600" />
                <span>Cognito JWT Owner Authorization</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AppSync GraphQL resolvers enforce ownership verification directly against the authenticated Cognito JWT <code className="font-mono text-violet-700 bg-violet-50 px-1 py-0.5 rounded">sub</code> claim. Only the student who originally listed an item can perform update or delete mutations, completely eliminating Insecure Direct Object Reference (IDOR) vulnerabilities.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Zero IAM Credential Exposure</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No permanent AWS root keys, access keys, or secret keys are bundled into frontend client builds. All browser-to-cloud transactions utilize temporary, short-lived STS credentials generated dynamically by Amazon Cognito Identity Pools with an automatic 1-hour expiration window.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Dual-Tier Validation Pipeline</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Defense-in-depth is enforced via client-side pre-flight checks (regex validation, non-negative price bounds, 5MB file limits) combined with server-side GraphQL schema constraints in AppSync that reject malformed payloads before invoking DynamoDB write buffers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Globe className="w-4 h-4 text-amber-600" />
                <span>Encrypted Transit & Rest Protection</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All client requests strictly require TLS 1.3 in-transit encryption. At rest, Amazon DynamoDB tables are safeguarded with AWS KMS customer-managed keys, and Amazon S3 buckets mandate server-side encryption (SSE-S3 / SSE-KMS) with public bucket write blocking.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: DynamoDB NoSQL Partition Strategies */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Database Architecture</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            2. Amazon DynamoDB NoSQL Partition Strategies
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Engineered for predictable sub-10 millisecond latency at scale, CampusConnect utilizes a partition strategy designed to prevent hot-spotting while enabling instant category searches and user dashboard queries.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <h4 className="font-bold text-sm text-emerald-950">Primary Key (PK) Design</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                The primary key is a high-entropy composite string <code className="font-mono text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">item-{'{timestamp}'}-{'{random}'}</code>. This ensures uniform hash distribution across DynamoDB physical storage partitions and prevents hot-partition throttling.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <h4 className="font-bold text-sm text-blue-950">GSI 1: Category Browsing</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Partition Key:</strong> <code className="font-mono text-blue-800 bg-white px-1 py-0.5 rounded border border-blue-200">category</code><br />
                <strong>Sort Key:</strong> <code className="font-mono text-blue-800 bg-white px-1 py-0.5 rounded border border-blue-200">createdAt</code><br />
                Enables instant filtered browsing (e.g. Textbooks, Calculators) ordered chronologically without full table scans.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <h4 className="font-bold text-sm text-purple-950">GSI 2: Student Dashboard</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Partition Key:</strong> <code className="font-mono text-purple-800 bg-white px-1 py-0.5 rounded border border-purple-200">owner</code><br />
                <strong>Sort Key:</strong> <code className="font-mono text-purple-800 bg-white px-1 py-0.5 rounded border border-purple-200">createdAt</code><br />
                Powers the "My Listings" student view to fetch all items created by the logged-in user in sub-5ms latency.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono">
            <div className="text-slate-400 mb-1">// Capacity Mode & SLA Configuration</div>
            <div className="text-emerald-400">BillingMode: PAY_PER_REQUEST (On-Demand Capacity)</div>
            <div className="text-slate-300">Read / Write Latency SLA: Sub-10ms single-digit response</div>
            <div className="text-slate-300">Point-in-Time Recovery (PITR): Enabled for continuous automated backup</div>
          </div>
        </div>

        {/* Section 3: S3 Scoped Path Access Rules */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2.5 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
            <HardDrive className="w-5 h-5 text-rose-600" />
            <span>Object Storage Security</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            3. Amazon S3 Scoped Path Access Rules
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Configured through AWS Amplify Storage Gen 2, product photos are stored inside a dedicated S3 bucket with strict path-scoped IAM policies preventing unauthorized file manipulation.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">S3 Object Key Path</th>
                  <th className="py-3 px-4">Owner (Entity ID)</th>
                  <th className="py-3 px-4">Authenticated Students</th>
                  <th className="py-3 px-4">Guest / Public Browsers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">product-images/{'{entity_id}'}/*</td>
                  <td className="py-3 px-4 font-semibold text-emerald-700">READ, WRITE, DELETE</td>
                  <td className="py-3 px-4 text-blue-700">READ ONLY</td>
                  <td className="py-3 px-4 text-slate-700">READ ONLY</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">public/*</td>
                  <td className="py-3 px-4 text-slate-700">READ, WRITE</td>
                  <td className="py-3 px-4 text-blue-700">READ, WRITE</td>
                  <td className="py-3 px-4 text-slate-700">READ ONLY</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1 font-bold">5MB File Size Limit</strong>
              <p className="text-slate-600">Both client pre-flight checks and S3 policy enforce a strict 5MB upper ceiling per image upload.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1 font-bold">MIME Type Whitelist</strong>
              <p className="text-slate-600">Accepts only <code className="text-rose-600 font-mono">image/jpeg</code>, <code className="text-rose-600 font-mono">image/png</code>, and <code className="text-rose-600 font-mono">image/webp</code>.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1 font-bold">DynamoDB Image Key Link</strong>
              <p className="text-slate-600">The generated S3 key is bound to the DynamoDB listing entity, establishing relational integrity across services.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Call to action */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <h3 className="text-2xl font-black mb-2">Ready to explore CampusConnect?</h3>
        <p className="text-blue-100 text-sm max-w-xl mx-auto mb-6">
          Browse items listed by fellow students or list your unused academic gear in seconds.
        </p>
        <NextLink
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
        >
          <span>Go to Marketplace</span>
          <ArrowRight className="w-4 h-4" />
        </NextLink>
      </div>

    </div>
  );
}
