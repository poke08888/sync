import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';
import Sidebar from "@/components/layout/Sidebar";
import GlobalFilters from "@/components/layout/GlobalFilters";
import { FilterProvider } from "@/context/FilterContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecom OS - Dashboard",
  description: "E-commerce Multi-brand Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <FilterProvider>
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <GlobalFilters />
                {children}
              </main>
            </div>
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
