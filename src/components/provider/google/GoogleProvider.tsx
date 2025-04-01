"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
   const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ``;
   console.log({ "ở đây nà": CLIENT_ID, TEST_RUN_TIME: process?.env?.TEST_RUN_TIME });
   return <GoogleOAuthProvider clientId={CLIENT_ID}>{children}</GoogleOAuthProvider>;
}
