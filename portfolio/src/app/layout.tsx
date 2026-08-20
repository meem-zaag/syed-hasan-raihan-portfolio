import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getProfile, getSettings } from "@/lib/api";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export const maxDuration = 60;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  const title = settings?.seoDefaultTitle ?? "Syed Hasan Raihan — Software Engineer";
  const description =
    settings?.seoDefaultDescription ??
    "Portfolio of Syed Hasan Raihan, a software engineer specializing in React, Next.js, and performance-driven UI engineering.";

  return {
    title: { default: title, template: `%s · ${title}` },
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile().catch(() => null);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-noise flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScrollProvider>
            <Navbar fullName={profile?.fullName ?? "Portfolio"} />
            <main className="flex-1 pt-16">{children}</main>
            <Footer profile={profile} />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
