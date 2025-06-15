import jwt from "jsonwebtoken";

export const generateJwtTokenAndSetCookie = async (userId, res) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        if(!token) {
            return res.json({
                message: "Failed to create token."
            })
        }

        res.cookie("authjwttoken", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 1000, // 7 days
        })

        return token;

    } catch (error) {
        // res.status(500).json({
        //     success: false,
        //     message: `something went wrong server error : ${error}`
        // })

    console.log(`error while generating jwt token : ${error}`);

    }

    
}