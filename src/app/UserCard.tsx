"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";

function UserCard({ session }: { session: Session }) {
  return (
    <div>
      <div>
        Username: {session.user?.name}
        <br />
        Email: {session.user?.email}
      </div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}

export default UserCard;
