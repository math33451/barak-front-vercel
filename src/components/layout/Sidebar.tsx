import React from "react";
import {
  Car,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  Settings,
  X,
  FileMinus2,
} from "lucide-react";
import Link from "next/link";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
};

const NavItem = ({ href, icon, label, isActive = false }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 p-3 rounded-md ${
      isActive
        ? "bg-[color:var(--primary)] bg-opacity-10 text-[color:var(--primary)]" // Changed text-white to text-[color:var(--primary)]
        : "hover:bg-gray-100 text-[color:var(--foreground)]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

type SidebarProps = {
  isOpen: boolean;
  closeSidebar?: () => void;
  activePath: string;
};

export default function Sidebar({
  isOpen,
  closeSidebar,
  activePath,
}: SidebarProps) {
  const navigation = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      href: "/veiculos",
      label: "Veículos",
      icon: <Car className="h-5 w-5" />,
    },
    {
      href: "/vendas",
      label: "Vendas",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/financiamento",
      label: "Financiamento",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      href: "/configuracoes",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      href: "/bancos",
      label: "Bancos",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      href: "/despesas",
      label: "Despesas",
      icon: <FileMinus2 className="h-5 w-5" />,
    },
  ];

  // Desktop sidebar
  const desktopSidebar = (
    <aside className="hidden md:flex flex-col w-64 border-r border-[color:var(--border)]">
      <div className="p-5 border-b border-[color:var(--border)]">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-[color:var(--primary)]" />
          <h1 className="text-xl font-bold text-[color:var(--primary)]">
            Ayra Carrangos
          </h1>
        </div>
      </div>
      <nav className="flex-1 p-5 space-y-1">
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={activePath === item.href}
          />
        ))}
      </nav>
    </aside>
  );

  // Mobile sidebar
  const mobileSidebar = isOpen ? (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={closeSidebar}
      ></div>
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white p-5 overflow-y-auto z-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6 text-[color:var(--primary)]" />
            <h1 className="text-xl font-bold text-[color:var(--primary)]">
              Ayra Carrangos
            </h1>
          </div>
          <button onClick={closeSidebar}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={activePath === item.href}
            />
          ))}
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
}