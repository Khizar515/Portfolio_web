import { Geist, Geist_Mono } from "next/font/google";
import BackgroundEffects from '@/components/BackgroundEffects';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Khizar Nadeem | Portfolio",
  description: "Full-Stack & Mobile Developer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-on-surface`}
      >
        <BackgroundEffects />
        {children}
      </body>
    </html>
  );
}
