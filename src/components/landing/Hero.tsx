'use client';

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ApiKeysModal from "./ApikeysModal";

export default function Hero() {

  const [isApiOpen,setIsApiOpen]=useState<boolean>(false);

  return (
    <section className="pt-20 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            <span className="text-red-500">Doc</span>
            <span className="text-white">Mind</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your personal research assistant that turns information into clear ideas.
          </p>
        </div>
        
        <div className="mb-12 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-red-600/50 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href='/chat' className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
            Try DocMind
          </Link>
          <button onClick={()=>setIsApiOpen(true)} className="border-2 border-gray-600 hover:border-white text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all">
            API Keys
          </button>
        </div>
      </div>
      <ApiKeysModal
        isOpen={isApiOpen}
        onClose={()=>setIsApiOpen(false)}
      />
    </section>
  );
}