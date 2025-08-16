"use client";
import React, { useState } from "react";

export default function LoginPage() {
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
      <h1>createAccount</h1>
    </div>
  );
}
