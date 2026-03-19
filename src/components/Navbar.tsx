"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Tamaños", path: "/tamanos" },
    { name: "Sucursales", path: "/sucursales" },
    { name: "Calculadora", path: "/calculadora" },
    { name: "Preguntas Frecuentes", path: "/faq" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-brand-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={handleLinkClick}>
              <Image
                src="/logos/TOROBOX PNG.PNG"
                alt="Logo ToroBox"
                width={150}
                height={50}
                className="object-contain h-12 w-auto"
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  pathname === link.path ? "text-brand-red font-bold" : "text-brand-dark hover:text-brand-red"
                } transition-colors duration-200 text-sm font-medium`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
             <Link href="/como-contratar" className="bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors duration-200">
                Cómo Contratar
             </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-dark hover:text-brand-red focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={handleLinkClick}
                className={`${
                  pathname === link.path ? "text-brand-red font-bold bg-red-50" : "text-brand-dark hover:text-brand-red hover:bg-gray-50"
                } block px-3 py-3 rounded-md text-base font-medium transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/como-contratar"
              onClick={handleLinkClick}
              className="block mt-4 px-3 py-3 text-center rounded-md font-medium text-white bg-brand-red hover:bg-brand-red-hover transition-colors"
            >
              Cómo Contratar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
