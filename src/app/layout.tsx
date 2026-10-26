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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('campusconnect_theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0B1320] text-slate-100 selection:bg-teal-500/20 selection:text-teal-300 transition-colors duration-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
