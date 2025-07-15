'use client';
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="bg-cover bg-center bg-no-repeat text-white min-h-screen w-screen"
      style={{ backgroundImage: `url('/images/night_cover_betterVersion.png')` }}
    >

      {/* Top Navbar  */}
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-4 p-5">
          <img src="/images/MM_logo_V1.png" alt="logo" className="md:w-13 md:h-13 w-8 h-8"/>
          <h1 className="oranienbaum-regular font-extralight md:text-[24px] text-[15px] justify-center items-center">MeteorMate</h1>
        </div>
        <button className="cursor-pointer font-outfit font-normal md:text-[14px] text-[10px] p-1"><p className="outfit-regular">How It Works</p></button>

        <button className="cursor-pointer md:text-[14px] text-[10px] p-1">
          <p className="outfit-regular">Get Started</p>
        </button>
        <button className="cursor-pointer md:text-[14px] text-[10px] p-1">
          <p className="outfit-regular">Contact Us</p>
        </button>
        <button className="px-15 cursor-pointer md:text-[14px] text-[10px]"><p className="outfit-regular border-0 bg-white text-black rounded-[100px] px-5 py-2">Login</p></button>
      </div>

      {/* This div is for the center text */}
      <div className="outfit-bold mt-27">
        <h1 className="body-work font-extrabold md:text-[85px] text-[30px] flex justify-center">Find your Perfect Roommate</h1>
        <h1 className="body-work font-extrabold md:text-[85px] text-[30px] flex justify-center">Here at UT Dallas.</h1>
      </div>

      {/* for the find your roommate today button */}
        <div className="flex justify-center items-center">
          <button className="bg-white/10 md:px-7 md:py-4 p-2 rounded-[100px] border-0 md:text-[24px] text-[10px] flex justify-center button-find cursor-pointer mt-2 hover:bg-gradient-to-br from-orange-400 to-yellow-500 transition duration-2000 ease-linear">Find Your Roommate Today</button>
        </div>
    </div>
  );
}
