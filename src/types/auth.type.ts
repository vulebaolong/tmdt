import { TUser } from "@/schemas/user.schema";
import { Credentials } from "google-auth-library";

export type TRegisterReq = {
   fullName: string;
   email: string;
   password: string;
};

export type TRegisterRes = TUser;

export type TLoginFormReq = {
   email: string;
   password: string;
};

export type TLoginGoogleAuthenticatorReq = {
   email?: string;
   password?: string;
   token?: string;
   code?: string;
};

export type TPayloadSaveSecret = {
   token: string;
   secret: string;
};

export type TPayloadDisableSecret = {
   token: string;
};

export type TVerifyGAReq = {
   token: string;
};

export type TLoginRes = {
   accessToken: string | null;
   refreshToken: string | null;
   isGoogleAuthenticator: boolean;
   deviceId: string;
};

export interface ISessionUser {
   access_token: string;
   refresh_token: string;
}

export type TStepLogin = "login-form" | "login-google-authentication";

export type TPayloadLoginGoogleAuthenticator = {
   email?: string;
   password?: string;
   token?: string;
   tokensGoogle?: Credentials
};
