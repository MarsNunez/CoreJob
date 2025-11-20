import mongoose from "mongoose";

const { Schema } = mongoose;

const ServiceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categores_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price_type: {
      type: String,
      required: true,
      enum: [
        "precio fijo",
        "por hora",
        "por sesion",
        "por metro cuadrado",
        "por dia",
        "por unidad",
        "por persona",
        "por proyecto",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    estimated_duration: {
      type: String,
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    materials_included: {
      type: Boolean,
      default: false,
    },
    discount_aplied: {
      type: Boolean,
      default: false,
    },
    discount_recurring: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    requirements: {
      type: String,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceModel = mongoose.model("Service", ServiceSchema);
