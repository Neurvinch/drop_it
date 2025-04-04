const jwt = require("jsonwebtoken");

exports.identifer =
  (roles = []) =>
  async (req, res, next) => {
    let token = req.headers.authorization || req.cookies["Authorization"];
    if (!token) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    try {
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      if (roles.length && !roles.includes(decoded.roles)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("❌ Error in identifier middleware:", error);
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
  };
