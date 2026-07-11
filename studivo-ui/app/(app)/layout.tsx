"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMounted } from "@/shared/hooks/useMounted";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { Sidebar } from "@/shared/components/Sidebar";
import { Navbar } from "@/shared/components/Navbar";
import { SocketProvider } from "@/shared/providers/SocketProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { refetchOnWindowFocus: false, retry: 1 },
      },
    })
  );

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060913] text-slate-900 dark:text-white antialiased transition-colors duration-300">

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Workspace Area */}
            <div className="flex flex-col min-h-screen md:ps-64">
              <Navbar />
              <main className="flex-1 p-4 md:p-6 pt-20 md:pt-20 overflow-y-auto">
                {children}
              </main>
            </div>

          </div>
        </ThemeProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}