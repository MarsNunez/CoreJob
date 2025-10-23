import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["client", "provider"],
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    location_country: String,
    location_city: String,
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
