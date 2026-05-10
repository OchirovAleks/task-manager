const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(createError("Authorization header is required", 401));
    }
    const [type, token] = authHeader.split(" ")
    if (type !== "Bearer" || !token) {
        return next(createError("Invalid authorization format", 401));
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return next(createError("Invalid or expired token", 401));
    }
}

module.exports = { requireAuth };