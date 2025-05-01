"use client"; 

import { SessionProvider } from "next-auth/react";
import Navbar from './Navbar';

export default function SessionWrapper({ children, session }) {
  return (
  <>
  <SessionProvider session={session}>
  <Navbar />
  <div 
      className="relative h-screen" 
      style={{ background: "url('/bg.jfif')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.8 }} />
    {children}
    </div>
    </SessionProvider>
  </>
  );
}
