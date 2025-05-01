"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative z-10 grid place-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      
      <div className="max-w-xl flex flex-col gap-4 w-full">
        <button
          onClick={() => router.push("/signin")}
          className="bg-gradient-to-r from-gray-600 to-gray-400 text-white text-lg px-4 py-2 rounded-md w-full hover:from-gray-500 hover:to-gray-300 transition-colors duration-200"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/register")}
          className="bg-gradient-to-r from-gray-600 to-gray-400 text-white text-lg px-4 py-2 rounded-md w-full hover:from-gray-500 hover:to-gray-300 transition-colors duration-200"
        >
          Sign Up
        </button>
      </div>
      
    </div>
  );
}
