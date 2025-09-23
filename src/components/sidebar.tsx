"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { motion } from "framer-motion";

type SidebarProps = {
  onClose: () => void;
};

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-gray-800 text-white flex flex-col shadow-lg relative"
    >
      <button
        className="absolute top-3 right-3 p-1 rounded hover:bg-gray-700"
        onClick={onClose}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      <nav className="mt-12 space-y-2 px-4">
        <a href="/chat" className="block py-2 hover:bg-gray-700 rounded">
          Chat
        </a>
        <a href="/profile" className="block py-2 hover:bg-gray-700 rounded">
          Profile
        </a>
        <a href="/settings" className="block py-2 hover:bg-gray-700 rounded">
          Settings
        </a>
      </nav>
    </motion.div>
  );
}
