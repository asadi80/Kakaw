import connectToDatabase from "../../../utils/dbLocal";
import User from "../../../models/User";
import Link from "../../../models/Link";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract linkId and userId from the request body
  const { linkId, userId } = req.body;

  // Validate input
  if (!linkId || !userId) {
    return res.status(400).json({ error: "Link ID and User ID are required" });
  }

  console.log(`Deleting link with ID: ${linkId} for user with ID: ${userId}`);

  try {
    // Connect to the database
    await connectToDatabase();

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user owns the link (optional, for security)
    if (!user.links.includes(linkId)) {
      return res.status(403).json({ error: "Link not found in user's links" });
    }

    // Delete the link from the Link collection
    const deletedLink = await Link.findByIdAndDelete(linkId);
    if (!deletedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Remove the link ID from the user's links array
    user.links.pull(linkId);
    await user.save();

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
