"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      localStorage.setItem("adminSidebarCollapsed", String(!prev));
      return !prev;
    });
  };

  return (
    <div className="flex h-screen bg-(--color-navy)">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={toggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-[margin] duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 shrink-0 bg-(--color-navy-surface) border-b border-(--color-navy-border)">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-(--color-white-muted) hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <p className="font-['Cormorant_Garamond'] text-lg">
            <span className="text-(--color-gold)">Rapid</span>
            <span className="text-white">Luxe</span>
          </p>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
