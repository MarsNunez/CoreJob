import mongoose from "mongoose";

const { Schema } = mongoose;

const PortfolioItemSchema = new Schema(
  {
    profile_id: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PortfolioItemModel = mongoose.model(
  "PortfolioItem",
  PortfolioItemSchema
);

