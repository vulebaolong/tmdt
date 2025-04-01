"use server";

import { NEXT_PUBLIC_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/constant/app.constant";
import { ENDPOINT } from "@/constant/endpoint.constant";
import api from "@/helpers/api.helper";
import { clearTokens, getAccessToken, setAccessToken, setRefreshToken } from "@/helpers/cookies.helper";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import User, { TUser } from "@/schemas/user.schema";
import { TRes } from "@/types/app.type";
import { TLoginFormReq, TLoginRes, TRegisterReq } from "@/types/auth.type";
import { TLoginFacebookReq } from "@/types/facebook.type";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

export async function getUsersAction() {
   await connectDB();
   const users = await User.find().lean();
   return JSON.parse(JSON.stringify(users));
}

export async function registerAction({ email, fullName, password: rawPassword }: TRegisterReq) {
   try {
      await connectDB();

      const passwordHashed = await bcrypt.hash(rawPassword, 10);

      const newUser = await User.create({
         email,
         fullName,
         password: passwordHashed,
      });

      return JSON.parse(JSON.stringify(newUser));
   } catch (error) {
      console.error("Register failed:", error);
   }
}

export async function loginFacebookction(payload: TLoginFacebookReq) {
   try {
      const { data } = await api.post<TRes<TLoginRes>>(ENDPOINT.AUTH.FACEBOOK_LOGIN, payload);

      if (data?.accessToken && data?.refreshToken) {
         await setAccessToken(data?.accessToken);
         await setRefreshToken(data?.refreshToken);
      }

      return data;
   } catch (error) {
      console.error("Login failed:", error);
      throw error;
   }
}

export async function loginGooleAction(payload: { code: string }) {
   try {
      await connectDB();

      const { code } = payload;

      const oAuth2Client = new OAuth2Client(NEXT_PUBLIC_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "postmessage");

      const { tokens } = await oAuth2Client.getToken(code);
      const decoded: any = jwt.decode(tokens.id_token || "");

      if (!decoded || decoded.email_verified === false) {
         throw new Error("Email verification failed");
      }

      const { sub, email, name, picture } = decoded;

      let userExist = await User.findOne({ email });

      if (userExist) {
         await User.updateOne(
            { _id: userExist._id },
            {
               $set: {
                  avatar: userExist.avatar || picture,
                  googleId: userExist.googleId || sub,
                  fullName: userExist.fullName || name,
               },
            }
         );
      } else {
         userExist = await User.create({
            email,
            googleId: sub,
            fullName: name,
            avatar: picture,
         });
      }

      const accessToken = signAccessToken((userExist._id as any).toString());
      const refreshToken = signRefreshToken((userExist._id as any).toString());

      await setAccessToken(accessToken);
      await setRefreshToken(refreshToken);

      return true;
   } catch (error) {
      console.error("Login google failed:", error);
      throw error;
   }
}

export async function loginFormAction(payload: TLoginFormReq) {
   try {
      await connectDB();

      const userExist = await User.findOne({ email: payload.email }).select("+password").lean();
      console.log({ userExist });
      if (!userExist) throw new Error(`Login failed`);

      if (!userExist.password) throw new Error(`Vui lòng đăng nhập bằng google hoặc facebook`);

      const match = await bcrypt.compare(payload.password, userExist.password);
      if (!match) throw new Error(`Login failed`);

      const accessToken = signAccessToken(userExist._id.toString());
      const refreshToken = signRefreshToken(userExist._id.toString());

      await setAccessToken(accessToken);
      await setRefreshToken(refreshToken);

      return JSON.parse(JSON.stringify(userExist));
   } catch (error) {
      console.error("Login failed:", error);
      throw error;
   }
}

export async function loginGoogleAuthenticatorAction(payload: TLoginFormReq) {
   try {
      const { data } = await api.post<TRes<TLoginRes>>(ENDPOINT.AUTH.LOGIN_GOOGLE_AUTHENTICATOR, payload);

      if (data?.accessToken && data?.refreshToken) {
         await setAccessToken(data?.accessToken);
         await setRefreshToken(data?.refreshToken);
      }

      return data;
   } catch (error) {
      console.error("Login failed:", error);
      throw error;
   }
}

export async function getInfoAction(): Promise<TUser | false> {
   try {
      const accessToken = await getAccessToken();
      if (!accessToken) return false;

      const isAccessToken = verifyAccessToken(accessToken);

      await connectDB();
      const users = await User.findOne({ _id: isAccessToken.sub }).lean();

      return JSON.parse(JSON.stringify(users));
   } catch (error) {
      console.error("Get info failed:", error);
      throw error;
   }
}

export async function clearTokensAction() {
   try {
      await clearTokens();
      return true;
   } catch (error) {
      console.error("Clear Token Failed:", error);
      throw error;
   }
}
