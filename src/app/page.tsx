"use client";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-4xl font-bold text-center text-blue-500">
        Welcome to Next.js!
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signOut()}
      >
        cerrar sesion
      </button>
    </div>
  );
}
