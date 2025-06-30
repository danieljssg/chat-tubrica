import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"],
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Evitar recompilación del modelo en desarrollo
const Message = models?.Message || model("Message", MessageSchema);

export default Message;
