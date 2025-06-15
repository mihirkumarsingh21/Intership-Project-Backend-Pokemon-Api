import { transport } from "./nodemailer.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js";

export const sendVerificationEmailToken = async (email, verificationToken) => {
    try {

       const info = await transport.sendMail({
            from: ` Mihir Kumar  <${process.env.USER_EMAIL}> `,
            to: email,
            subject: "Verify Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        })
        
        console.log(`Verification email sent: ${info.response}`);
        return { success: true, response: info.response };

    } catch (error) {
         console.log(`Error while sending verification email: ${error}`);
         throw new Error("Failed to send verification email");
        
    }
}
