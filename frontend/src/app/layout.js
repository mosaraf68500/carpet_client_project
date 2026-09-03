import {
  Nunito,
  Source_Sans_3,
  Source_Serif_4,
  Italiana,
  Jost,
} from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/components/layout/UIProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import JsonLd from "@/components/common/JsonLd";
import { SITE_URL, organizationJsonLd } from "@/lib/seo";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: ["400"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luxury handmade carpets online | Doha Carpet سجاد الدوحة",
    template: "%s",
  },
  description:
    "Shop Doha Carpet سجاد الدوحة's kilims and rugs online, handmade using traditional techniques and premium materials. Find modern, classic and transitional carpets online.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${sourceSans3.variable} ${sourceSerif4.variable} ${italiana.variable} ${jost.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-body font-body">
        <JsonLd data={organizationJsonLd()} />
        <UIProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileMenu />
          <FloatingContactButtons />
        </UIProvider>
      </body>
    </html>
  );
}
