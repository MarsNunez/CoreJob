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
    availability_calendar: {
      type: Schema.Types.Mixed,
      default: {},
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
  },
  {
    timestamps: true,
  }
);

export const ProfileModel = mongoose.model("Profile", ProfileSchema);
