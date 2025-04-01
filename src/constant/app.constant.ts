export const MOBILE_VISIBLE_DESKTOP_HIDDEN = `mantine-hidden-from-md`;
export const MOBILE_HIDDEN_DESKTOP_VISIBLE = `mantine-visible-from-md`;
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const NEXT_LOCALE = "NEXT_LOCALE";

export const BASE_DOMAIN_API = process.env.BASE_DOMAIN_API || `http://localhost:3069/`;
// export const BASE_DOMAIN_API = process.env.NEXT_PUBLIC_BASE_DOMAIN_API || `https://be-node.vulebaolong.com/`;
export const BASE_DOMAIN_CLOUDINARY = `https://res.cloudinary.com/vulebaolong/image/upload/`;
export const FOLDER_IMAGE_BE = `images/`;

export const TITLE = `TMDT`;

export const MONGODB_URI = process.env.MONGODB_URI;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const TEST_RUN_TIME = process.env.TEST_RUN_TIME;

export const SHIPPING_FEE = 0;

console.log({
   BASE_DOMAIN_API,
   BASE_DOMAIN_API_pro: process.env.NEXT_PUBLIC_BASE_DOMAIN_API,
   MONGODB_URI,
   ACCESS_TOKEN_SECRET,
   ACCESS_TOKEN_EXPIRES,
   REFRESH_TOKEN_SECRET,
   REFRESH_TOKEN_EXPIRES,
   CLOUDINARY_NAME,
   CLOUDINARY_API_KEY,
   CLOUDINARY_API_SECRET,
   NEXT_PUBLIC_GOOGLE_CLIENT_ID,
   GOOGLE_CLIENT_SECRET,
   TEST_RUN_TIME
});
