const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
    //401 Unauthorized
        return res.status(401).json({
        success: false,
        message: "Access token denied",
    });
    try {
        const key = process.env.SECRET_KEY;
        //jwt.verify(token,secret key)
        const decoded = jwt.verify(token, key);
        //get decode and dispatcher it with request
        req.userId = decoded.userId;
        //Pass
        next();
    } catch (e) {
        console.log(e);
        //403 forbidden
        return res.status(403).json({
            success: false,
            message: "Invalid token",
        });
    }

}

module.exports = verifyToken