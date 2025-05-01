"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Both email and password are required");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address");
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="relative z-10 max-w-2xl mx-auto p-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Sign In</h2>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-2 mb-6"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <button className="mt-5 bg-black border border-white  text-white px-4 py-2 rounded" type="submit">
          Sign In
        </button>
        <button
          type="button"
          className="bg-red-500 border border-white text-white px-4 py-2 rounded"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Sign in with Google
        </button>
        <small>Don&apos;t have an account? <Link href="/register" className="font-bold underline hover:text-gray-600">Sign up </Link></small>
      </form>
    </div>
  );
}
