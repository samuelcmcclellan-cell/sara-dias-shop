import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESTAMPA — Bold prints. Premium tees. $50.",
  description:
    "Exclusive all-over-print designs by Sara Dias. Sublimation-printed on premium polyester. Delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-background font-sans text-primary antialiased">
        <LanguageProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
