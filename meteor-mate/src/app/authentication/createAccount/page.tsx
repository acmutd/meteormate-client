"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
  };

  const handleCreateAccount = () => {
    if (!email.endsWith('.edu')) {
      setEmailError('Please enter a valid .edu email.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    console.log('Creating account with', { email, password });
  };

  return (
    <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg px-25 py-15 text-black text-center drop-shadow-[#575757] drop-shadow-xl">
      {/* go back arrow*/}
      <div className="flex justify-start mb-4 absolute top-2 left-5">
        <button onClick={() => window.history.back()} className="text-gray text-3xl cursor-pointer">
          ←
        </button>
      </div>
      <h1 className="font-urbanist font-semibold md:text-[40px] text-[20px]">
        Create an Account
      </h1>
      {/* email input */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-3 text-left w-full">
          <label className="text-left text-sm font-normal text-gray-700">UTD Email</label>
          <div className="relative w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>

            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="abc123452@utdallas.edu"
              className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
            />
          </div>
          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
          {/* pass input */}
          <label className="text-left text-sm font-normal text-gray-700">Password</label>
          <div className="relative w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>

              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Your Password"
                className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
              />
          </div>
          {/* confirm pass*/}
          <label className="text-left text-sm font-normal text-gray-700">Verify Password</label>
          <div className="relative w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>

              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Re-Enter Password"
                className="pl-11 pr-4 border border-black py-2 rounded-3xl font-light text-[12px] md:text-[15px] text-left w-full"
              />
          </div>
          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
          <button
            onClick={handleCreateAccount}
            className="mt-3 text-sm bg-[#509275] text-white py-2.5 rounded-3xl hover:bg-gray-800 transition cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
      <div className="text-right mt-0">
        <button className="text-white text-sm hover:underline cursor-pointer">Have an Account? Login</button>
      </div>
    </div>
  );
}
