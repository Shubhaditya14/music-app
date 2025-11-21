"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Home, Music, History, Menu, X } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-xl md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-64 bg-gray-900 p-6 flex flex-col hidden md:flex"
      >
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Music App</h1>
        <nav className="flex-grow">
          <ul>
            <li className="mb-4">
              <Link href="/" className="flex items-center text-lg hover:text-blue-400 transition">
                <Home size={20} className="mr-3" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/songs" className="flex items-center text-lg hover:text-blue-400 transition">
                <Music size={20} className="mr-3" /> Catalogue
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/recents" className="flex items-center text-lg hover:text-blue-400 transition">
                <History size={20} className="mr-3" /> Recents
              </Link>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed inset-y-0 left-0 w-64 bg-gray-900 p-6 flex flex-col z-40 md:hidden"
          >
            <h1 className="text-3xl font-bold mb-8 text-blue-400">Music App</h1>
            <nav className="flex-grow">
              <ul>
                <li className="mb-4">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center text-lg hover:text-blue-400 transition">
                    <Home size={20} className="mr-3" /> Home
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/songs" onClick={() => setIsOpen(false)} className="flex items-center text-lg hover:text-blue-400 transition">
                    <Music size={20} className="mr-3" /> Catalogue
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/recents" onClick={() => setIsOpen(false)} className="flex items-center text-lg hover:text-blue-400 transition">
                    <History size={20} className="mr-3" /> Recents
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
