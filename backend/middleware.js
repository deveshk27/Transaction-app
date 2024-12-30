const JWT_SECRET = require("./config");
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const userdata = req.headers.authorization;

    if (!userdata || !userdata.startsWith('Bearer')) {
        return res.json(403).json({});
    }

    const token = userdata.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.json(403).json({});
    }
}

module.exports = {
    authMiddleware
}