const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    status: {
      type: String,
      enum: ["planning", "in_progress", "done"],
      default: "planning",
    },

    budget: { type: Number, default: 0 },

    startDate: { type: Date },
    endDate: { type: Date },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);