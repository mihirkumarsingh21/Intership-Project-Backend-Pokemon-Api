import Joi from "joi";

export const userSchema = Joi.object({

    username: Joi.string().alphanum().lowercase().min(3).max(20).required(),
    
    email: Joi.string().email(
        {
            tlds: { allow: ["com", "net"] }
        }
    ).lowercase().pattern( new RegExp( /^\S+@\S+\.\S+$/)).required(),

    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

    isVerified: Joi.boolean().default(false),

    resetPasswordToken: Joi.string(),

    resetPasswordTokenExpireAt: Joi.date(),

    verificationToken: Joi.string(),

    verificationTokenExpireAt: Joi.date()

}) 