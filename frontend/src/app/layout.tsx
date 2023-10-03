"use client"

import './globals.css'
import type { Metadata } from 'next'
import { useState, useEffect } from "react";
import { Inter } from 'next/font/google'

import Header from "@/components/Header";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* <!-- ===== Header Start ===== --> */}
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            {/* <!-- ===== Header End ===== --> */}
              <div>
              {children}
              </div>
          </div>
        </div>
      </body>
    </html>
  )
}
