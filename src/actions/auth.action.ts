"use server";

import { GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_GOOGLE_CLIENT_ID, TITLE } from "@/constant/app.constant";
import { clearTokens, getAccessToken, setAccessToken, setRefreshToken } from "@/helpers/cookies.helper";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import User, { TUser } from "@/schemas/user.schema";
import {
   TLoginFormReq,
   TPayloadDisableSecret,
   TPayloadLoginGoogleAuthenticator,
   TPayloadSaveSecret,
   TRegisterReq,
   TVerifyGAReq,
} from "@/types/auth.type";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { authenticator } from "otplib";
import qrcode from "qrcode";

export async function getUsersAction() {
   await connectDB();
   const users = await User.find().lean();
   return JSON.parse(JSON.stringify(users));
}

export async function registerAction({ email, fullName, password: rawPassword }: TRegisterReq) {
   try {
      await connectDB();

      const userExist = await User.findOne({ email }).select("+password").lean();
      if (userExist) throw new Error(`Email already exist`);

      const passwordHashed = await bcrypt.hash(rawPassword, 10);

      const newUser = await User.create({
         email,
         fullName,
         password: passwordHashed,
      });

      return JSON.parse(JSON.stringify(newUser));
   } catch (error) {
      console.error("Register failed:", error);
      throw error;
   }
}

// export async function loginFacebookction(payload: TLoginFacebookReq) {
//    try {
//       const { data } = await api.post<TRes<TLoginRes>>(ENDPOINT.AUTH.FACEBOOK_LOGIN, payload);

//       if (data?.accessToken && data?.refreshToken) {
//          await setAccessToken(data?.accessToken);
//          await setRefreshToken(data?.refreshToken);
//       }

//       return data;
//    } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//    }
// }

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

      let userExist = await User.findOne({ email }).select("+googleAuthenticator");

      if (userExist?.googleAuthenticator) {
         console.log(`Login with google authenticator`);
         return { isGoogleAuthenticator: true, tokens };
      }

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

      return { isGoogleAuthenticator: false, tokens: null };
   } catch (error) {
      console.error("Login google failed", error);
      throw error;
   }
}

async function handlePasswordLogin(userExist: TUser, password: TLoginFormReq["password"]) {
   if (!userExist) throw new Error(`Login failed`);
   if (!userExist.password) throw new Error(`Please login with google or facebook`);

   console.log({ pass1: password, pass2: userExist.password });
   const match = await bcrypt.compare(password, userExist.password);
   if (!match) throw new Error(`Login failed`);

   const accessToken = signAccessToken((userExist._id as any).toString());
   const refreshToken = signRefreshToken((userExist._id as any).toString());

   await setAccessToken(accessToken);
   await setRefreshToken(refreshToken);
}

export async function loginFormAction(payload: TLoginFormReq) {
   try {
      await connectDB();

      const userExist = await User.findOne({ email: payload.email }).select("+password +googleAuthenticator").lean();
      console.log({ userExist });
      if (!userExist) throw new Error(`Login failed`);

      if (userExist.googleAuthenticator) {
         console.log(`Login with google authenticator`);
         return { isGoogleAuthenticator: true };
      }

      await handlePasswordLogin(userExist, payload.password);

      return JSON.parse(JSON.stringify(userExist));
   } catch (error) {
      console.error("Login failed:", error);
      throw error;
   }
}

export async function loginGoogleAuthenticatorAction(payload: TPayloadLoginGoogleAuthenticator) {
   try {
      const { email, password, token, tokensGoogle } = payload;
      if (!token) throw new Error(`Please provide the OTP code`);

      // Trường hợp: login bằng password
      if (password) {
         if (!email) throw new Error(`Please provide the email`);

         const userExist = await User.findOne({ email: email }).select("+password +googleAuthenticator").lean();

         if (!userExist) throw new Error(`Login failed`);
         if (!userExist.googleAuthenticator) throw new Error(`Tài Khoản Chưa Bật Google Authenticator`);

         const isValid = authenticator.check(`${token}`, userExist.googleAuthenticator);
         if (!isValid) throw new Error(`Check Token OTP failed`);

         await handlePasswordLogin(userExist, password);

         return true;
      } else {
         // Trường hợp: login bằng google

         if (!tokensGoogle) throw new Error(`Provide the tokens from google`);

         const decoded: any = jwt.decode(tokensGoogle.id_token || "");

         if (!decoded || decoded.email_verified === false) {
            throw new Error("Email verification failed");
         }

         const { sub, email, name, picture } = decoded;

         let userExist = await User.findOne({ email }).select("+googleAuthenticator");

         if (!userExist) throw new Error(`Login failed`);
         if (!userExist.googleAuthenticator) throw new Error(`Tài Khoản Chưa Bật Google Authenticator`);

         const isValid = authenticator.check(`${token}`, userExist.googleAuthenticator);
         if (!isValid) throw new Error(`Check Token OTP failed`);

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
      }
   } catch (error) {
      console.error("Login failed:", error);
      throw error;
   }
}

export async function getInfoAction(googleAuthenticatorType: "boolean" | "secret" = "boolean"): Promise<TUser | false> {
   try {
      const accessToken = await getAccessToken();
      if (!accessToken) return false;

      const isAccessToken = verifyAccessToken(accessToken);

      await connectDB();

      let users = await User.findOne({ _id: isAccessToken.sub }).select("+googleAuthenticator").lean();

      users = JSON.parse(JSON.stringify(users));

      if (googleAuthenticatorType === "boolean") {
         users = {
            ...users,
            googleAuthenticator: users?.googleAuthenticator ? true : false,
         } as any;
      }

      return users as any;
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

export async function generateGaAction() {
   try {
      const info = await getInfoAction("secret");
      if (!info) throw new Error("Please login");

      // Tạo secret cho người dùng
      const secret = authenticator.generateSecret();

      // Tạo URL cho ứng dụng Google Authenticator
      const otpauth = authenticator.keyuri(info.email, TITLE, secret);

      // Tạo QR code từ URL
      const qrCode = await qrcode.toDataURL(otpauth);

      return { qrCode, secret };
   } catch (error) {
      console.error("Generate Google Authenticator Error", error);
      throw error;
   }
}

export async function saveSecrectAction({ token, secret }: TPayloadSaveSecret) {
   try {
      const info = await getInfoAction("secret");
      if (!info) throw new Error("Please login");

      if (!token) throw new Error(`Please provide the OTP code`);
      if (!secret) throw new Error(`Please provide the secret`);

      const isValid = authenticator.check(`${token}`, secret);

      if (isValid) await User.updateOne({ _id: info._id }, { $set: { googleAuthenticator: secret } });

      return { status: isValid };
   } catch (error) {
      console.error("Save Google Authenticator Error", error);
      throw error;
   }
}

export async function disableSecrectAction({ token }: TPayloadDisableSecret) {
   try {
      const info = await getInfoAction("secret");
      if (!info) throw new Error("Please login");

      if (!token) throw new Error(`Please provide the OTP code`);
      if (!info.googleAuthenticator) throw new Error(`Tài Khoản Chưa Bật Google Authenticator`);

      const isValid = authenticator.check(`${token}`, info.googleAuthenticator);

      if (isValid) await User.updateOne({ _id: info._id }, { $set: { googleAuthenticator: "" } });

      return { status: isValid };
   } catch (error) {
      console.error("Disable Google Authenticator Error", error);
      throw error;
   }
}

export async function verifyGAAction({ token }: TVerifyGAReq) {
   try {
      const info = await getInfoAction("secret");
      if (!info) throw new Error("Please login");

      if (!token) throw new Error(`Please provide the OTP code`);
      if (!info.googleAuthenticator) throw new Error(`Tài Khoản Chưa Bật Google Authenticator`);

      const isValid = authenticator.check(`${token}`, info.googleAuthenticator);

      return { status: isValid };
   } catch (error) {
      console.error("Verify Google Authenticator Error", error);
      throw error;
   }
}
