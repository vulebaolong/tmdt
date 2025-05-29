import mongoose, { Document, Model, Schema } from "mongoose";

export type TUser = {
   email: string;
   fullName: string;
   password?: string;
   googleAuthenticator?: string;
   avatar?: string;
   facebookId?: string;
   googleId?: string;
   address?: string;
   phone?: string;
   role: number;
   createdAt: string;
   updatedAt: string;
} & Document;

const UserSchema = new Schema<TUser>(
   {
      email: { type: String, required: true, unique: true },
      fullName: { type: String, required: true },
      password: { type: String, select: false },
      googleAuthenticator: { type: String, select: false },
      avatar: { type: String },
      facebookId: { type: String },
      googleId: { type: String },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      role: { type: Number, required: true, default: 1 }, // 0: ADMIN / 1: USER
   },
   {
      collection: "Users",
      timestamps: true,
   }
);

const User: Model<TUser> = mongoose.models.User || mongoose.model<TUser>("User", UserSchema);

export default User;
