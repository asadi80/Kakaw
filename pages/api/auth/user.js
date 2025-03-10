import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";
import Link from "../../../models/Link";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Ensure only GET requests are allowed
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} is not allowed.` });
  }

  const { id } = req.query;

  try {
    // Connect to the database
    await connectToDatabase();

    // Validate the user ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    // Fetch the user by ID, exclude sensitive fields, and populate the links
    const user = await User.findById(id)
      .select("-password -__v") // Exclude password and version key
      .populate({
        path: "links", // Field to populate
        model: Link, // Model to use for population
        select: "-__v", // Exclude version key from populated documents
      })
      .lean(); // Convert to plain JavaScript object for performance

    // Log the user object for debugging
    console.log("User after population:", user);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the user object with populated links
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "An error occurred while fetching the user profile." });
  }
}