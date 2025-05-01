"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session]);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return setError("All fields required");

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await axios.post("/api/register", {
        email,
        name,
        password: hashedPassword,
      });
      router.push("/signin");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn w-full mt-4">
          Register
        </button>
      </form>
    </div>
  );
}
