"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

    if (!email || !password || !name) {
      return setError("All fields are required");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError("Password must be at least 8 characters long and contain at least one number and one letter");
    }

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
    <div className="relative z-10 max-w-2xl mx-auto p-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Register</h2>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-2 mb-6"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
            className="flex-1 px-4 py-2 border rounded text-black"
            placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
            className="flex-1 px-4 py-2 border rounded text-black"
            placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
            className="flex-1 px-4 py-2 border rounded text-black"
            placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="mt-5 bg-black border border-white  text-white px-4 py-2 rounded">
          Register
        </button>
        <button
          type="button"
          className="bg-red-500 border border-white text-white px-4 py-2 rounded"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Sign up with Google
        </button>
        <small>Already have an account? <Link href="/signin" className="font-bold underline hover:text-gray-600">Sign in </Link></small>

      </form>
    </div>
  );
}
