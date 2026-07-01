import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "RideSphere - Multi-Vehicle Rental & Tourism Booking Platform",
  description: "Book city rides, rent self-drive vehicles, bikes, luxury cars, tourist buses, and customize tour packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${firaSans.variable} ${firaCode.variable} antialiased bg-[#07090e] text-[#f1f5f9] min-h-screen flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
