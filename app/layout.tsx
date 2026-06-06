import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/cmd/CommandPalette";
import { VisitBeacon } from "@/components/visitors/VisitBeacon";

// Two-font system:
//   Hanken Grotesk (--font-body) = body text AND headings
//   JetBrains Mono (--font-mono) = labels/metadata AND the masthead name
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shrey Ghildiyal - Full-Stack Engineer",
  description:
    "Full-stack engineer with backend roots, building across AI and product. In active development - currently in Galway, Ireland.",
  openGraph: {
    title: "Shrey Ghildiyal - Full-Stack Engineer",
    description:
      "Full-stack engineer with backend roots, building across AI and product. In active development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${hankenGrotesk.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
          <CommandPalette />
          <VisitBeacon />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </body>
    </html>
  );
}
