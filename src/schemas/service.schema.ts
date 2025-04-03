import mongoose, { Document, Model, Schema } from "mongoose";

export interface IService extends Document {
   thumbnail: string;
   title: string;
   content: string;
   createdAt: Date;
   updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
   {
      thumbnail: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
   },
   { timestamps: true, collection: "Services" }
);

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
