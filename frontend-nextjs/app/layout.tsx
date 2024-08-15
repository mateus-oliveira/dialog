'use client'

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import authenticationRequired from "@/utils/authenticationRequired";
import PrivateRoute from "@/app/components/privateRoute";
import PublicRoute from "@/app/components/publicRoute";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPrivatePage = authenticationRequired(pathname);
  return (
    <html lang="en">
      <head>
        <title>Dialog</title>
      </head>
      <body className={inter.className}>
        {!isPrivatePage && <PublicRoute>{children}</PublicRoute>}
        {isPrivatePage && <PrivateRoute>{children}</PrivateRoute>}
      </body>
    </html>
  );
}
