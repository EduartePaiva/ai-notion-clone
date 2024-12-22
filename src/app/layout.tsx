import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/header";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
    title: "Ai Notion Clone",
    description: "A notion clone with ai capability",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <link
                    rel="icon"
                    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😎</text></svg>"
                />

                <body>
                    <ReactQueryProvider>
                        <Header />
                        <div className="flex min-h-screen">
                            {/* Sidebar */}
                            <Sidebar />

                            <div className="scrollbar-hide flex-1 overflow-y-auto bg-gray-100 p-4">
                                {children}
                            </div>
                        </div>
                        <Toaster position="top-center" />
                    </ReactQueryProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
