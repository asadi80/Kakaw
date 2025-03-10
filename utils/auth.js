import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return handler(req, res);
  };
}
