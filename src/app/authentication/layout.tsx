import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url('/images/plinthAuthPic.jpg')` }}
    >
      {children}
    </div>
  );
}
