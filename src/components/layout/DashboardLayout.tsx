'use client';

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

type DashboardLayoutProps = {
  children: React.ReactNode;
  title: string;
  activePath: string;
};

export default function DashboardLayout({
  children,
  title,
  activePath,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[color:var(--background)]">
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        activePath={activePath}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} openSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
