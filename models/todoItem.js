const mongoose = require("mongoose");
let TodoItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("TodoItem", TodoItemSchema);
