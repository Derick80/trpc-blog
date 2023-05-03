import Link from "next/link";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-r from-slate-900 to-slate-700">
      <nav className="fixed flex z-10 h-16 w-full flex-wrap items-center justify-between bg-gray-800 p-6">
        <div>
        <h2 className="text-2xl font-bold text-white">Derick's tRPC Blog</h2>

        </div>
        <ul className="mr-6 flex flex-shrink-0 items-center gap-2 text-white">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
        </ul>
        <div></div>
      </nav>

      <main className="relative mt-20 flex w-full flex-1 flex-col gap-3 px-20 text-center text-slate-50 md:flex-row">
        <div className="flex w-full flex-col items-center border-2 py-2 md:min-h-screen md:w-1/5">

        </div>
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center border-2 py-2 md:w-4/5">
          {children}
        </div>
      </main>
      <footer className="flex h-24 w-full items-center justify-center border-t">
        <ul className="mr-6 flex flex-shrink-0 items-center gap-2 text-white">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
