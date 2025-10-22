"use client";

import "./globals.css";
import { AuthProvider } from "../contexts/authContext"; // adjust the path if your folder is named `contexts/authContext`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
