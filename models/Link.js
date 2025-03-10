import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);

export default Link;
