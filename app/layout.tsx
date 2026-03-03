import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo/json-ld";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vacation Vibez | Sri Lanka Travel Experts",
  description:
    "Experience Sri Lanka with luxury escapes, cultural journeys, and tailor-made adventures curated with care. Design your dream trip with Vacation Vibez.",
  keywords: [
    "Sri Lanka travel",
    "luxury travel",
    "custom itineraries",
    "Sri Lanka tours",
    "travel agency",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
      {GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){ dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `}
          </Script>
        </>
      )}
    </html>
  );
}
