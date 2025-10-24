import mongoose from "mongoose";

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pendiente", "completada", "cancelada"],
      default: "pendiente",
    },
    request_date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    scheduled_date: {
      type: Date,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    payment_status: {
      type: String,
      required: true,
      enum: ["pagado", "pendiente", "cancelado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.model("Booking", BookingSchema);
