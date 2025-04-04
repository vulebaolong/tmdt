import mongoose, { Model } from "mongoose";

interface ISetting {
   key: string;
   value: string;
}

const settingSchema = new mongoose.Schema(
   {
      key: { type: String, required: true, unique: true },
      value: { type: String, required: true },
   },
   { timestamps: true, collection: "Settings" }
);

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>("Setting", settingSchema);

export default Setting;
