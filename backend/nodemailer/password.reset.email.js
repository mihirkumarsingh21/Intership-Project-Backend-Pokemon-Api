import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./email.template.js";
import { transport } from "./nodemailer.config.js";

export const sendPasswordResetLink = async (email, passwordRsetLink) => {
    try {
    const info = await transport.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Password reset link",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", passwordRsetLink),
        
    })

    console.log(`password reset link response : ${info.response}`);
    
    return { success: true, response: info.response }
    
} catch (error) {
    console.log(`error while sending password reset link email : ${error}`);
    
    throw new Error(`server error failed to send password reset link email :${error}`)
}
}