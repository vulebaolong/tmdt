import mongoose, { Document, Model, Schema } from "mongoose";

export type TUser = {
   email: string;
   fullName: string;
   password: string;
   avatar?: any;
   facebookId?: any;
   googleId?: any;
   createdAt: string;
   updatedAt: string;
} & Document;

const UserSchema = new Schema<TUser>(
   {
      email: { type: String, required: true, unique: true },
      fullName: { type: String, required: true },
      password: { type: String, required: true, select: false },
      avatar: { type: Schema.Types.Mixed },
      facebookId: { type: Schema.Types.Mixed },
      googleId: { type: Schema.Types.Mixed },
   },
   {
      collection: "Users",
      timestamps: true,
   }
);

const User: Model<TUser> = mongoose.models.User || mongoose.model<TUser>("User", UserSchema);

export default User;
