import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideNav from "./_component/SideNav";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIQUARIUS",
  description: "AIQUARIUS",
  icons: "./favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="d-flex">
          <SideNav />
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}
