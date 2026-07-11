import { ThemeProvider } from "../shared/components/ThemeProvider";
// import { Sidebar } from "../shared/components/Sidebar";
// import { Navbar } from "../shared/components/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studivo",
  description: "E-Commerce Platform",
  icons: {
    icon: [{ url: "/favicon.png"  }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* الـ Layout الكبير: سايدبار جانبي + منطقة محتوى مرنة */}
          <div className="flex min-h-screen">
            {/* ١. السايدبار ثابت في الجنب */}
            {/* <Sidebar /> */}

            {/* ٢. منطقة الـ Navbar والمحتوى الفعلي */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* <Navbar /> */}
              <main className="flex-1 p-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}