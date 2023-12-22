"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <main>
      <p className="text-danger">Hello its main page</p>
      {session?.data && <Link href="/adminpanel">Dashboard</Link>}

      {session?.data ? (
        <Link
          href=""
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          Sign Out
        </Link>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </main>
  );
}
