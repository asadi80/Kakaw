import connectToDatabase from "../../../utils/dbLocal";
import User from "../../../models/User";
import Link from "../../../models/Link";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, url, userId } = req.body;

  if (!title || !url || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Basic URL validation
  const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?[\w-./?%&=]*)$/;
  if (!urlRegex.test(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    await connectToDatabase();

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the link already exists for this user
    const existingLink = await Link.findOne({ url, userId });
    if (existingLink) {
      return res.status(400).json({ error: "Link already exists" });
    }

    // Create a new link
    const newLink = new Link({
      title,
      url,
     
    });

    // Save the link to the database
    await newLink.save();

    // Update the user's links array
    user.links.push(newLink._id);
    await user.save();

    res.status(201).json({ message: "Link added successfully", newLink });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
