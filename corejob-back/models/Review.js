import mongoose from "mongoose";

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    is_anonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = mongoose.model("Review", ReviewSchema);
