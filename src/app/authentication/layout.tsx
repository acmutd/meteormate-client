import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen w-screen flex items-center justify-center relative"
      style={{ backgroundImage: `url('../star.svg')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#2E86AB] to-[#1B4965]"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}