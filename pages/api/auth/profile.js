import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";
import Link from "../../../models/Link";

import mongoose from "mongoose";

export default async function handler(req, res) {
  const { userId } = req.query;

  // Validate userId format before querying
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid user ID format." });
  }

  try {
    await connectToDatabase();

    if (req.method === "GET") {
      // Fetch user and populate links, excluding sensitive fields
      const user = await User.findById(userId)
        .select("-password ")
        .populate({
          path: "links",
          model: Link,
          select: "-__v", // Exclude unnecessary fields from populated links
        })
        .lean();

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      return res.status(200).json(user);
    }

    if (req.method === "PUT") {
      const { name, profilePicture, phone, occupation, socialLinks } = req.body;

      // Ensure at least one field is provided
      if (!name && !profilePicture && !phone && !occupation && !socialLinks) {
        return res.status(400).json({ error: "At least one field is required to update the profile." });
      }

      // Fetch the existing user
      const existingUser = await User.findById(userId).select("-password");
      if (!existingUser) {
        return res.status(404).json({ error: "User not found." });
      }

      // Prepare the update data
      const updateData = {};
      if (name) updateData.name = name;
      if (profilePicture) updateData.profilePicture = profilePicture;
      if (phone) updateData.phone = phone;
      if (occupation) updateData.occupation = occupation;

      // Update socialLinks safely
      if (socialLinks) {
        updateData.socialLinks = {
          ...existingUser.socialLinks.toObject(), // Convert Mongoose object to plain object
          ...socialLinks, // Merge only provided fields
        };
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      )
        .select("-password")
        .populate({
          path: "links",
          select: "-__v",
        });

      return res.status(200).json(updatedUser);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  } catch (error) {
    console.error("Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
}
