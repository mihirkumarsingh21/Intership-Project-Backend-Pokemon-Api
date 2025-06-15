import jwt from "jsonwebtoken";

export const authenticatedUser = (req, res, next) => {

    try {
        
        const authToken = req.cookies["authjwttoken"] || req.cookies.authjwttoken;
        console.log("auth token: ", authToken);

            if(!authToken || !req.cookies["authjwttoken"]) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized User Found - JWT Token Not Found"
                })
            }

            const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            console.log(`decoded value: ${JSON.stringify(decoded)}`);

            if(!decoded) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to verify jwt token"
                })
            }

            req.user = decoded.userId;
        //    const userID = req.user = decoded.userId;
        //    console.log(`userID: ${userID}`);

            next();
        
    } catch (error) {
        console.log(`error while verifying jwt token: ${error}`);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}