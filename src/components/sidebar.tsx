"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, List, PlusCircle, BarChart2, Briefcase } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Menu items.
const items = [
  { url: "/", title: "Home", icon: Home },
  { url: "/transactions", title: "Transactions", icon: List },
  { url: "/add", title: "Add", icon: PlusCircle },
  { url: "/visualize", title: "Visualize", icon: BarChart2 },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="relative h-screen">

      <Sidebar className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <SidebarContent className="p-4 bg-black text-white">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-3 p-3 text-lg font-medium hover:bg-gray-100 rounded-md transition">
                        <item.icon size={50} className="text-primary" />
                        <span className="text-base uppercase">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}
