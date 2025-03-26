const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
  
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
  
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };

  const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  };
  
  const authorizeCustomer = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }
    if (req.user.role !== "Customer") {
      return res.status(403).json({ message: "Forbidden: Customer access required" });
    }
    next();
  };
  

module.exports = { authMiddleware, authorizeAdmin, authorizeCustomer };
