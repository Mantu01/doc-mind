"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ApiKeysModal from "./ApikeysModal";

export default function Header() {
  const [hasKeys, setHasKeys] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    checkKeys();
  }, []);

  const checkKeys = (): void => {
    const keyNames = ['openai', 'claude', 'gemini'];
    const hasAnyKey = keyNames.some(keyName => localStorage.getItem(keyName));
    setHasKeys(hasAnyKey);
  };

  const handleModalClose = (): void => {
    setShowModal(false);
    checkKeys();
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href='/' className="flex items-center space-x-3">
            <Image
              src='/logo.png'
              height={32}
              width={32}
              alt="logo"
            />
            <h1 className="text-2xl font-bold pt-2">
              <span className="text-red-500">Doc</span>
              <span className="text-white">Mind</span>
            </h1>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            {hasKeys ? (
              <Link href='/chat' className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                Start Chat
              </Link>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </nav>
      </header>

      <ApiKeysModal 
        isOpen={showModal}
        onClose={handleModalClose}
      />
    </>
  );
}