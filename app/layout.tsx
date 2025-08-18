import AppLayout from "@/src/components/cross/layout";
import cn from "@/src/utils/cn";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ualá",
  description: "Web Developer Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body
        className={cn(
          "bg-background text-foreground antialiased",
          publicSans.className
        )}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
