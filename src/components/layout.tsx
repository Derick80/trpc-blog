import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Button from "./button";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: sessionData } = useSession();

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-r from-slate-900 to-slate-700">
      <nav className="fixed z-10 flex h-20 w-full flex-wrap content-center items-center justify-between bg-gray-800 p-6">
        <div className="flex flex-grow">
          <h2 className="text-2xl font-bold text-white">Derick's Blog</h2>
        </div>
        <ul className="mr-6 flex flex-shrink-0 items-center gap-2 text-white">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ul>
        <div className="flex flex-grow" />
        <div className="flex flex-shrink-0 flex-col items-center gap-2 text-white">
          <Button
            variant="danger_filled"
            size="small"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
          <p className="hidden text-center text-base text-white md:flex">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
        </div>
        <div></div>
      </nav>

      <main className="relative mt-20 flex w-full flex-1 flex-col gap-3 px-20 text-center text-slate-50 md:flex-row">
        <div className="flex w-full flex-col items-center border-2 border-purple-500 py-2 md:min-h-screen md:w-1/5"></div>
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center border-2 border-red-500 py-2  md:w-4/5">
          {children}
        </div>
      </main>
      <footer className="flex h-24 w-full items-center justify-center border-t">
        <ul className="mr-6 flex flex-shrink-0 items-center gap-2 text-white">
          <li>
            <a
              referrerPolicy="no-referrer"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/dhoskinson/"
            >
              LinkedIn
            </a>
          </li>
          <li>copywrite {new Date().getFullYear()}</li>
          <li>
            <a
              referrerPolicy="no-referrer"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Derick80"
            >
              GitHub
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
