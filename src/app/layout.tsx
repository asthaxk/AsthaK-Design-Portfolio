import type { Metadata } from "next";
import { Karla, Inter } from "next/font/google";
import "./globals.css";

const karla = Karla({ variable: "--font-karla", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astha Khurana",
  description:
    "Product Designer and UX Specialist. Freelancing, building no-code websites and designing products at SaaS startups.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans md:h-dvh md:overflow-hidden">{children}</body>
    </html>
  );
}
