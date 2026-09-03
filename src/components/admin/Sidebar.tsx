"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Package,
  Globe,
  Calendar,
  Star,
  Users,
  MessageSquare,
  Tag,
  Ticket,
  BarChart2,
  Settings,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Newspaper,
  UserCog,
  FolderOpen,
  Files,
  Building2,
  CircleHelp,
  Ban,
  ScrollText,
  Shield,
  Quote,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// ── Nav Config ────────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Destinations", href: "/admin/destinations", icon: Globe },
    ],
  },
  {
    label: "CMS",
    items: [
      { label: "Blog Posts", href: "/admin/blog", icon: Newspaper },
      { label: "Blog Authors", href: "/admin/blog/authors", icon: UserCog },
      {
        label: "Blog Categories",
        href: "/admin/blog/categories",
        icon: FolderOpen,
      },
      { label: "Static Pages", href: "/admin/pages", icon: Files, exact: true },
      { label: "About Us", href: "/admin/pages/about", icon: Building2 },
      { label: "FAQs", href: "/studio/structure/faqPage", icon: CircleHelp },
      {
        label: "Cancellation Policy",
        href: "/admin/pages/cancellation-policy",
        icon: Ban,
      },
      {
        label: "Terms & Conditions",
        href: "/admin/pages/terms",
        icon: ScrollText,
      },
      { label: "Privacy Policy", href: "/admin/pages/privacy", icon: Shield },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: Calendar },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Deals", href: "/admin/deals", icon: Tag },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// ── Nav Link ──────────────────────────────────────────────────────────────────

function NavLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 rounded-lg text-sm font-['DM_Sans'] font-medium transition-colors duration-150 ${
        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
      } ${
        isActive
          ? "bg-(--color-gold)/10 text-(--color-gold)"
          : "text-(--color-white-muted) hover:text-white hover:bg-white/5"
      }`}
    >
      <item.icon size={16} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen flex flex-col
        bg-(--color-navy-surface) border-r border-(--color-navy-border)
        transition-all duration-300
        ${collapsed ? "lg:w-16" : "lg:w-64"}
        w-64
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Logo + collapse toggle */}
      <div
        className={`border-b border-(--color-navy-border) flex items-center ${
          collapsed ? "justify-center py-5 px-2" : "justify-between px-6 py-5"
        }`}
      >
        {!collapsed && (
          <div>
            <p className="font-['Cormorant_Garamond'] text-xl">
              <span className="text-(--color-gold)">Rapid</span>
              <span className="text-white">Luxe</span>
            </p>
            <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-0.5">
              Admin Panel
            </p>
          </div>
        )}

        {/* Mobile close — only when open on mobile */}
        <button
          onClick={onMobileClose}
          className="lg:hidden text-(--color-white-muted) hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-(--color-white-muted) hover:text-white hover:bg-white/5 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 && <div className="h-px bg-(--color-navy-border) my-2" />}

            {!collapsed && (
              <p className="text-[10px] font-['DM_Sans'] font-semibold text-(--color-text-secondary) uppercase tracking-widest px-3 pt-4 pb-1">
                {group.label}
              </p>
            )}
            {collapsed && gi > 0 && <div className="py-1" />}

            {group.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}

        <div className="h-px bg-(--color-navy-border) my-2" />
        <Link
          href="/"
          title={collapsed ? "Back to Site" : undefined}
          className={`flex items-center gap-3 rounded-lg text-sm font-['DM_Sans'] font-medium text-(--color-white-muted) hover:text-white hover:bg-white/5 transition-colors duration-150 ${
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
          }`}
        >
          <ArrowLeft size={16} className="shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </nav>

      {/* User area */}
      <div
        className={`border-t border-(--color-navy-border) flex items-center gap-3 p-4 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <UserButton />
        {!collapsed && user && (
          <p className="text-sm font-['DM_Sans'] text-(--color-white-muted) truncate">
            {user.fullName ?? user.primaryEmailAddress?.emailAddress}
          </p>
        )}
      </div>
    </aside>
  );
}
