import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Inter } from "next/font/google";
import "./globals.css";
import "./original-razen.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import AmbientGlow from "@/components/layout/AmbientGlow";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Arcfumes — Niche Luxury Fragrance House",
  description:
    "Arcfumes — Niche luxury fragrance. Minimal. Modern. Unforgettable. Explore our signature trio: Elma, Mavi, and Serin. Handcrafted in limited batches.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Arcfumes — Niche Luxury Fragrance House",
    description: "Signature fragrances, crafted for presence. Minimal. Modern. Unforgettable.",
    images: ["/razen-assets/landing1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased bg-white text-razen-black selection:bg-razen-gold/20 selection:text-razen-black">
        <CartProvider>
          <AmbientGlow />
          <div className="flex flex-col min-h-screen relative z-10">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
