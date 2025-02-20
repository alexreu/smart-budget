import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { RootProviders } from "@/providers/RootProviders";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SmartBudget",
    description: "A smart way to manage your money",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Toaster richColors position="bottom-right" />
                    <RootProviders>{children}</RootProviders>
                </body>
            </html>
        </ClerkProvider>
    );
}
