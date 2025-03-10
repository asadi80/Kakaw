import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000",
    },
    phone: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    aboutMe: {
      type: String,
      default: "",
    },
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link"
      },
    ],
  },
  { timestamps: true }
);

// Prevent model re-registration in serverless environments
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
