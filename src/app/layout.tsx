import type { Metadata } from "next";
import { Karla, Silkscreen } from "next/font/google";
import "./globals.css";

const karla = Karla({ variable: "--font-karla", subsets: ["latin"] });
const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Astha Khurana",
  description:
    "Design leader and 0-1 specialist. Building AI tools used in thousands of Indian courtrooms at Adalat AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans md:h-dvh md:overflow-hidden">{children}</body>
    </html>
  );
}
