import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "JobSpark - Land Your Dream Job with AI-Powered Career Tools",
  description: "Join thousands of South African job seekers who've accelerated their careers with our intelligent platform. Get personalized CV generation, interview coaching, and direct employer connections.",
  keywords: "job search, career tools, CV builder, interview coaching, South Africa jobs",
  authors: [{ name: "JobSpark" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}