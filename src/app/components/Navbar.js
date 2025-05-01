"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuth = () => {
    if (session) {
      signOut({ callbackUrl: "/" });
    } else {
      router.push("/signin");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-white via-black to-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={32}
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            {session && (
            <Link
              href="/dashboard"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Dashboard
            </Link>
            )}
            <button
              onClick={handleAuth}
              className="bg-gradient-to-r from-gray-600 to-gray-400 text-white px-4 py-2 rounded-md hover:from-gray-500 hover:to-gray-300 transition-colors duration-200"
            >
              {session ? "Logout" : "Login"}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-white">
            {session && (
          <Link
            href="/dashboard"
            className="block text-black hover:text-gray-300 transition-colors duration-200"
          >
            Dashboard
          </Link>
            )}
          <button
            onClick={handleAuth}
            className="w-full text-left bg-gradient-to-r from-gray-600 to-gray-400 text-white px-4 py-2 rounded-md hover:from-gray-500 hover:to-gray-300 transition-colors duration-200"
          >
            {session ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </nav>
  );
}
