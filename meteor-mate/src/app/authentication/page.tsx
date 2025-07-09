"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value.endsWith('@utdallas.edu')) {
      setEmailError('Email must end with @utdallas.edu');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (!email.endsWith('.edu')) {
      setEmailError('Please enter a valid .edu email.');
      return;
    }

    console.log('Logging in with', { email, password });
  };

  return (
    <div className="bg-white/25 backdrop-blur-md rounded-xl shadow-lg p-8 text-black text-center">
      <div className="flex justify-center md:px-50">
        <img src="/images/MM_logo_V1.png" alt="logo" className="md:w-30 md:h-30 w-20 h-20"/>
      </div>
      <h1 className="font-urbanist font-semibold md:text-[35px] text-[20px]">
        Welcome to MeteorMate
      </h1>
      <p className="font-urbanist font-light md:text-[12px] text-[10px] pb-3">
        Enhance your roommate search with AI powered matchmaking
      </p>
      <button onClick={() => router.push("/authentication/createAccount")} className="cursor-pointer border border-black py-2 rounded-3xl w-[80%] font-light text-[12px] md:text-[15px]">
        Create an account
      </button>

      {/* Creating the OR line here - aastha */}
      <div className="flex items-center justify-center w-[80%] gap-4 text-black py-4 mx-auto">
        <hr className="flex-grow border border-gray-800 border-b-0" />
        <span className="text-sm whitespace-nowrap">OR</span>
        <hr className="flex-grow border border-gray-800 border-b-0" />
      </div>


      {/* THis is all the login stuff below OR - aastha */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-5 text-left w-[80%]">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            className="border border-black py-2 rounded-3xl md:px-4 px-3 font-light text-[12px] md:text-[15px] text-left"
          />
          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}

          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="border border-black py-2 rounded-3xl md:px-4 px-3 font-light text-[12px] md:text-[15px] text-left"
          />

          <button
            onClick={handleLogin}
            className="mt-3 bg-[#509275] text-white py-2 rounded-3xl hover:bg-gray-800 transition cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>

      {/* this is the forgot password button */}
      <div className="text-right mt-2">
        <button className="text-white text-sm hover:underline cursor-pointer">Forgot password?</button>
      </div>
    </div>
  );
}
