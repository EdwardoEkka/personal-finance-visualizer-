"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, List, PlusCircle, BarChart2 } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/transactions", label: "Transactions", icon: List },
    { href: "/add", label: "Add", icon: PlusCircle },
    { href: "/visualize", label: "Visualize", icon: BarChart2 },
  ];

  return (
    <div className="flex md:h-screen relative">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5 shadow-lg  z-50 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          className="absolute top-5 right-5 md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <nav className="mt-10">
          <ul className="space-y-4">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile
                >
                  <Icon size={20} /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>


      <div className="flex-1 p-5 md:ml-52 flex gap-4 items-center justify-between">
        <button
          className="md:hidden p-2 bg-gray-800 text-white rounded"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="block md:hidden font-bold text-xl sm:text-3xl text-right">FINANCE VISUALIZER</h1>
      </div>
    </div>
  );
}
