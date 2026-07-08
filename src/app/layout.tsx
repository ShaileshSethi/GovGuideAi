import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NavigationLayout from "@/components/NavigationLayout";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GovGuide AI - Government Action Plans",
  description: "Tell us your problem. We'll tell you exactly what to do.",
};

import { auth } from "@/auth";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/context/LanguageContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans bg-background text-foreground" suppressHydrationWarning>
        <LanguageProvider>
          <NavigationLayout user={session?.user}>
            {children}
          </NavigationLayout>
          <Toaster position="bottom-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
