import { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES, REFRESH_TOKEN_SECRET } from "@/constant/app.constant";
import jwt from "jsonwebtoken";

export function signAccessToken(userId: string) {
   if (!ACCESS_TOKEN_SECRET) throw new Error(`ACCESS_TOKEN_SECRET is not defined in .env'`);
   if (!ACCESS_TOKEN_EXPIRES) throw new Error(`ACCESS_TOKEN_EXPIRES is not defined in .env'`);
   return jwt.sign({ sub: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES as any });
}

export function signRefreshToken(userId: string) {
   if (!REFRESH_TOKEN_SECRET) throw new Error(`REFRESH_TOKEN_SECRET is not defined in .env'`);
   if (!REFRESH_TOKEN_EXPIRES) throw new Error(`REFRESH_TOKEN_EXPIRES is not defined in .env'`);
   return jwt.sign({ sub: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES as any });
}

export function verifyAccessToken(token: string) {
   if (!ACCESS_TOKEN_SECRET) throw new Error(`ACCESS_TOKEN_SECRET is not defined in .env'`);
   return jwt.verify(token, ACCESS_TOKEN_SECRET);
}
export function verifyRefreshToken(token: string) {
   if (!REFRESH_TOKEN_SECRET) throw new Error(`REFRESH_TOKEN_SECRET is not defined in .env'`);
   return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
