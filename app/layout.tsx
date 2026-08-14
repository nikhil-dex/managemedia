import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import GrainOverlay from "@/components/effects/GrainOverlay";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://managemedia.in"),

  title: {
    default: "ManageMedia | Digital Marketing Agency in Delhi",
    template: "%s | ManageMedia",
  },

  description:
    "ManageMedia is a creative digital marketing agency in Delhi NCR offering digital marketing, social media marketing, performance marketing, SEO, web analytics, and website design & development.",

  keywords: [
    "ManageMedia",
    "digital marketing agency Delhi",
    "digital marketing agency Delhi NCR",
    "digital marketing company Delhi",
    "social media marketing Delhi",
    "performance marketing Delhi",
    "SEO agency Delhi",
    "web analytics Delhi",
    "website design Delhi",
    "website development Delhi",
    "creative digital agency Delhi",
  ],

  authors: [
    {
      name: "ManageMedia",
      url: "https://managemedia.in",
    },
  ],

  creator: "ManageMedia",
  publisher: "ManageMedia",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

 

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://managemedia.in",
    siteName: "ManageMedia",
    title: "ManageMedia | Digital Marketing Agency in Delhi",
    description:
      "Creative digital marketing solutions combining strategy, creativity and technology to help brands grow, connect with audiences and build stronger digital experiences.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "ManageMedia - Digital Marketing Agency",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ManageMedia | Digital Marketing Agency in Delhi",
    description:
      "Strategy, creativity and technology for brands building what comes next.",
    images: ["/android-chrome-512x512.png"],
  },

  alternates: {
    canonical: "https://managemedia.in",
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
      className={`${inter.variable} ${interTight.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <GrainOverlay />
        {children}
        <NoiseOverlay />
      </body>
    </html>
  );
}