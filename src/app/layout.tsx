import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToroBox - Renta de Mini Bodegas",
  description: "Espacios seguros para almacenar pertenencias personales, muebles, archivo o inventario de negocios. Instalaciones con vigilancia 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${montserrat.variable} antialiased font-sans flex flex-col min-h-screen bg-[#F2F2F2] text-[#111111] overflow-x-hidden`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
