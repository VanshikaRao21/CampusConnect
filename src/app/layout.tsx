import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'CampusConnect | AWS-Based Student Marketplace',
  description:
    'A modern AWS-powered marketplace for college students to buy and sell second-hand academic textbooks, calculators, lab gear, and supplies.',
  keywords: [
    'CampusConnect',
    'Student Marketplace',
    'AWS Amplify',
    'DynamoDB',
    'Amazon Cognito',
    'College Textbooks',
    'Used Calculators',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
