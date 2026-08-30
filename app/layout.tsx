import type { Metadata } from "next";
import "./globals.css";

import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // TODO
  title: {
    default: "Thakur Saad — MERN developer",
    template: "%s · Thakur Saad",
  },
  description:
    "Backend-leaning MERN developer. Projects, case studies and contact — arranged as an inbox.",
  openGraph: {
    type: "website",
    siteName: "Thakur Saad",
    locale: "en_US",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${roboto.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
