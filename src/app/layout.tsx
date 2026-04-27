import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import GHLTracking from "@/components/GHLTracking";
import UtmCapture from "@/components/UtmCapture";

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
  metadataBase: new URL("https://torobox.mx"),
  title: {
    default: "Torobox | Renta de mini bodegas en Guadalajara y Bucerías",
    template: "%s | Torobox",
  },
  description:
    "Renta de mini bodegas seguras y accesibles en Guadalajara, Zapopan, Tlajomulco y Bucerías. Vigilancia 24/7, acceso controlado y bodegas desde 1.75 m².",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://torobox.mx",
    siteName: "Torobox",
    title: "Torobox | Renta de mini bodegas en Guadalajara y Bucerías",
    description:
      "Renta de mini bodegas seguras y accesibles en Guadalajara, Zapopan, Tlajomulco y Bucerías. Vigilancia 24/7, acceso controlado y bodegas desde 1.75 m².",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torobox | Renta de mini bodegas en Guadalajara y Bucerías",
    description:
      "Renta de mini bodegas seguras y accesibles en Guadalajara, Zapopan, Tlajomulco y Bucerías. Vigilancia 24/7, acceso controlado y bodegas desde 1.75 m².",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PW9XVH8F');`,
          }}
        />
        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YN2CFK1MEZ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-YN2CFK1MEZ');`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} antialiased font-sans flex flex-col min-h-screen bg-[#F2F2F2] text-[#111111] overflow-x-hidden`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PW9XVH8F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Chatbot />
        <UtmCapture />
        <GHLTracking />
      </body>
    </html>
  );
}
