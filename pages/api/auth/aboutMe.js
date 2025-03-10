import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { aboutMe, userId } = req.body;

  if (!aboutMe || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await connectToDatabase();

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's aboutMe field
    user.aboutMe = aboutMe; // Directly assign the new value
    await user.save();

    res.status(200).json({ message: "About me updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}