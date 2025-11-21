import mongoose from "mongoose";

const { Schema } = mongoose;

const ProfileSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    profile_picture: {
      type: String,
      trim: true,
    },
    service_map_url: {
      type: String,
      trim: true,
    },
    service_address: {
      type: String,
      trim: true,
    },
    service_radius: {
      type: String,
      trim: true,
    },
    service_transport: {
      type: String,
      trim: true,
    },
    service_response_time: {
      type: String,
      trim: true,
    },
    service_emergency: {
      type: String,
      trim: true,
    },
    rating_average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    jobs_completed: {
      type: Number,
      default: 0,
      min: 0,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ProfileModel = mongoose.model("Profile", ProfileSchema);
