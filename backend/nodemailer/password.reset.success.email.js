import { transport } from "./nodemailer.config.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./email.template.js";


export const sendPasswordSuccessEmail = async (email) => {
    try {
        const info = await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Password reset success email",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        })

        return { success: true, response: info.response }

    } catch (error) {
        console.log(`error while sending success password email: ${error}`);
        
        throw new Error(`server error something went wrong : ${error}`);
    }
}