# CampusConnect: AWS-Based Student Marketplace Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![AWS Amplify Gen 2](https://img.shields.io/badge/AWS_Amplify-Gen_2-FF9900?logo=amazon-aws)](https://docs.amplify.aws/)
[![Amazon DynamoDB](https://img.shields.io/badge/Amazon_DynamoDB-Serverless_NoSQL-4053D6?logo=amazon-dynamodb)](https://aws.amazon.com/dynamodb/)
[![Amazon Cognito](https://img.shields.io/badge/Amazon_Cognito-Auth-DD344C?logo=amazon-cognito)](https://aws.amazon.com/cognito/)
[![Amazon S3](https://img.shields.io/badge/Amazon_S3-Storage-569A31?logo=amazon-s3)](https://aws.amazon.com/s3/)

**CampusConnect** is a college Cloud Technology / Cloud Application Development (CTDA) project. It is a full-stack, Gen Z-inspired student marketplace designed for buying, selling, and discovering second-hand academic essentials—including textbooks, scientific calculators, engineering drafters, and lab equipment.

---

## 🏛️ System Architecture

```
Student Browser (Next.js 14 Client)
       │
       ├──► AWS Amplify Hosting (Global Edge Distribution)
       │
       ├──► Amazon Cognito (Email Signup, JWT Tokens, Owner Authorization)
       │
       ├──► AWS AppSync (Managed GraphQL API Engine)
       │       │
       │       └──► Amazon DynamoDB (Listings NoSQL Fact Table)
       │
       └──► Amazon S3 via Amplify Storage (Product Photos & Media Assets)
```

1. **Frontend Layer**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons.
2. **Authentication Layer**: Amazon Cognito User Pool with JWT token verification.
3. **Data Layer**: AWS AppSync GraphQL API mapped to an Amazon DynamoDB table.
4. **Media Storage**: Amazon S3 bucket with scoped user identity directories (`product-images/{identity_id}/*`).
5. **Deployment**: AWS Amplify Gen 2 code-first infrastructure (`amplify/`).

---

## 🚀 Key Features

- **Responsive Marketplace Grid**: Multi-attribute filtering (category, condition, price range in ₹ INR) and live keyword search.
- **Academic Categories**: Textbooks, Calculators, Lab Equipment, Stationery (Mini-Drafters), Tech Accessories.
- **Instant Item Modal**: High-resolution image preview, condition guides, verified student owner badges, and direct WhatsApp/Email contact actions.
- **Sell an Item Form**: Client-side validation, price constraints (rejects negative numbers), and photo upload to Amazon S3.
- **My Listings Dashboard**: View owned items, edit prices in real-time, toggle availability (`ACTIVE` vs `SOLD`), and delete listings with confirmation safeguards.
- **Zero-Setup Demo Fallback**: Embedded persistent data adapter allowing immediate, flawless offline college demonstrations with pre-seeded academic items.
- **One-Click Seed Data Reset**: Built-in toolbar button to instantly restore clean demo records during a presentation.

---

## 🛠️ Project Structure

```
CampusConnect/
├── amplify/                       # AWS Amplify Gen 2 Cloud Backend
│   ├── auth/
│   │   └── resource.ts            # Amazon Cognito configuration
│   ├── data/
│   │   └── resource.ts            # AppSync & DynamoDB schema + authorization rules
│   ├── storage/
│   │   └── resource.ts            # Amazon S3 bucket definition
│   ├── backend.ts                 # Unified Amplify entrypoint
│   └── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Global layout, Navbar, and Footer
│   │   ├── page.tsx               # Marketplace grid & hero landing page
│   │   ├── globals.css            # Gen Z design tokens & styling
│   │   ├── create-listing/        # "Sell an Item" page with S3 upload
│   │   │   └── page.tsx
│   │   ├── my-listings/           # Student personal dashboard
│   │   │   └── page.tsx
│   │   └── about/                 # Cloud Architecture & SVG topology
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/                # Navbar and Footer components
│   │   └── marketplace/           # Hero, CategoryBar, SearchFilter, Cards, Modals
│   ├── lib/
│   │   ├── amplifyClient.ts       # Universal Data & Auth Client (Cloud + Local)
│   │   ├── mockData.ts            # Realistic college academic seed listings
│   │   └── validation.ts          # Input and image validation utilities
│   └── types/
│       └── listing.ts             # TypeScript domain interfaces
├── tests/
│   └── validation.test.mjs        # Automated unit tests
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/VanshikaRao21/CampusConnect.git
cd CampusConnect

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Automated Tests
```bash
npm test
```

---

## ☁️ AWS Cloud Deployment (Amplify Gen 2)

To deploy your backend to your personal or college AWS account:

### 1. Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and Default Region (e.g. ap-south-1)
```

### 2. Launch Local Cloud Sandbox
```bash
npx ampx sandbox
```
This deploys ephemeral cloud resources (Cognito, DynamoDB, S3) into your AWS account and generates `amplify_outputs.json` in your project root.

### 3. Deploy to AWS Amplify Hosting
1. Push your repository to GitHub.
2. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify).
3. Click **Deploy an app** > Select **GitHub** > Choose `CampusConnect`.
4. Amplify Gen 2 will automatically detect the `amplify/` directory and deploy the full stack with a public HTTPS URL.

---

## 🔒 Security & Authorization

- **Owner-Based Access Control (OBAC)**: Mutations on listing items are checked against Cognito identity claims. Users cannot delete or alter other students' listings.
- **Least-Privilege Media Storage**: Uploads to S3 are restricted to authenticated students in their personal entity directories (`product-images/{entity_id}/*`).
- **Input Sanitization**: Prices are bounded (`₹0` to `₹1,00,000`), image types are restricted to `image/jpeg`, `image/png`, and `image/webp` under 5MB.
- **Zero Hardcoded Secrets**: No AWS credentials or private keys exist in client-side code.

---

## 👥 Team Collaboration Matrix

| Member | Feature Branch | Core Responsibilities |
| :--- | :--- | :--- |
| **Member A (Lead / Repo Owner)** | `main` | Core architecture, Next.js 14 setup, Tailwind design tokens, Amplify Gen 2 backend schema, responsive Marketplace grid, search & filter engine, dual-mode client adapter. |
| **Member B (Friend 1)** | `feature/auth-and-dashboard` | Amazon Cognito Amplify Auth integration, user session management, "My Listings" personal dashboard, live price editing, availability toggles, and deletion safety modals. |
| **Member C (Friend 2)** | `feature/create-listing-and-architecture` | "Sell an Item" form with S3 photo upload, image previews, Listing Detail Modal with seller contact actions, and Cloud Architecture About page with SVG topology diagram. |

---

## 📜 Academic Coursework Notice
Developed as part of the **Cloud Technology / Cloud Application Development (CTDA)** course curriculum.
