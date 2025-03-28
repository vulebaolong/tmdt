import Provider from "@/components/provider/Provider";
import { TITLE } from "@/constant/app.constant";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: TITLE,
   description: "Generated by create next app",
};

type TProps = {
   children: React.ReactNode;
};

export default async function RootLayout({ children }: TProps) {
   const locale = await getLocale();
   const messages = await getMessages();

   return (
      <html lang={locale} {...mantineHtmlProps} suppressHydrationWarning>
         <head>
            {/* Favicon / Logo */}
            <link rel="icon" href="/logo/logo-icon.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/logo/logo-icon.png" />

            {/* Meta Tags for SEO */}
            <meta name="description" content="Browse stores and featured products with ease. Log in to shop securely on our eCommerce platform." />
            <meta
               name="keywords"
               content="ecommerce, online shopping, stores, products, shop online, buy online, electronics, clothing, home goods"
            />
            <meta name="author" content="TMDT Platform" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="UTF-8" />

            {/* Open Graph Tags for Social Media */}
            <meta property="og:title" content="TMDT - Online Shopping Platform" />
            <meta
               property="og:description"
               content="Explore thousands of stores and products. Log in to make secure purchases on our eCommerce platform."
            />
            <meta property="og:image" content="/logo/logo-icon.png" />
            <meta property="og:url" content="https://tmdt.vulebaolong.com" />
            <meta property="og:type" content="website" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="TMDT - Online Shopping Platform" />
            <meta name="twitter:description" content="Browse stores and products with ease. Log in to buy securely." />
            <meta name="twitter:image" content="/logo/logo-icon.png" />

            <ColorSchemeScript />
         </head>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <NextIntlClientProvider messages={messages}>
               <Provider>{children}</Provider>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}


// https://sepay.vn/lap-trinh-cong-thanh-toan.html
// https://www.notion.so/SEPAY-1c398db6991280d49ea1e111620a1261

// ssh tmdt_ctid@207.2.122.125
// - IP: 207.2.122.125
// - Port: 22
// - Username: tmdt_ctid
// - Password: 123456a@A