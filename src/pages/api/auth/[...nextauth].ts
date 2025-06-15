import NextAuth from "next-auth";

import { authOptions } from "@/server/auth";
export const runtime = 'nodejs';
export default NextAuth(authOptions);
