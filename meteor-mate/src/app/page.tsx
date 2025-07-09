'use client';
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="bg-cover bg-center bg-no-repeat text-white min-h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url('/images/night_cover.jpg')` }}
    >
      <button
        onClick={() => router.push("/authentication")}
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        LOGIN
      </button>
    </div>
  );
}
