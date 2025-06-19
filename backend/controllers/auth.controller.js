import { userSchema } from "../validations/user.validation.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJwtTokenAndSetCookie } from "../utils/generateJwtTokenAndSetCookie.js";
import { sendVerificationEmailToken } from "../nodemailer/verify.email.js";
import crypto from "crypto";
import { sendPasswordResetLink } from "../nodemailer/password.reset.email.js";
import { sendPasswordSuccessEmail } from "../nodemailer/password.reset.success.email.js";



export const registerUser = async (req, res) => {

    try {
      const { error, value } = userSchema.validate(req.body);

      if(error) {
       return res.status(400).json({
            success: false,
            message: error.details[0].message,
        })
      }

      const { username, email, password } = value;

      // console.table([
      //   `
      //   INPUT DATA : 

      //       username: ${username}
      //       email: ${email}
      //       password: ${password}

      //   `
      // ])


      const user = await User.findOne({where: {email: email}});      

      if(user) {
        return res.status(400).json({
            success: false,
            message: "User already exsit with this credentials."
        })
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      if(!hashedPassword) {
        return res.status(400).json({
            success: false,
            message: "Failed to hashed password."
        })
      }

      const  verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      
      const registeredUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpireAt: Date.now() + 1000 * 60 * 60 * 24 // 24hr
      })

      console.log(`registered user : ${registeredUser}`);
      

      if(!registeredUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid input : failed to register user please."
        })
      }

     await generateJwtTokenAndSetCookie(registeredUser.id, res);
    const emailResponse = await sendVerificationEmailToken(registeredUser.email, registeredUser. verificationToken);


     res.status(201).json({
      success: true,
      message: "user register successfully.",
       emailStatus: emailResponse.response,
      registeredUserData: registeredUser
     })


    } catch (error) {
        res.status(500).json({
          success: false,
          message: error || "Failed to register user."
        })

        console.log(`error while registering user: ${error}`);
        
    }
}

export const verifyingToken = async (req, res) => {
  try {
     const { verificationToken } = req.query;

     console.log(` 
            verificationToken: ${verificationToken}
      `);
     

     const user = await User.findOne({where: {
            verificationToken,
     }})

     if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token."
      })
     }

    user.isVerified = true;
    user.verificationToken = null
    user.verificationTokenExpireAt = null;

   await user.save();

   res.status(200).json({
    success: true,
    message: "email verification successfully."
   })
     

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error : something went wrong" |error
    })

    console.log(`error while verifying email token : ${error}`);
    
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {email: email}
    })

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential user not found please check your credential."
      })
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if(!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Password are incorrect please enter a valid password."
      })
    }

    await generateJwtTokenAndSetCookie(user.id, res);

    res.status(200).json({
      success: true,
      message: "User login successfully."
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "server error something went wrong."
    })

    console.log(`error while login user : ${error}`);
    
  }
}

export const logoutUser = async (_, res) => {
  try {
    res.clearCookie("authjwttoken");
    res.status(200).json({
      success: true,
      message: "User logout successfully."
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "server error something went wrong."
    })
  }
}

export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if(!email || email === undefined) {
        return res.status(400).json({
          success: false,
          message: "This field is required to get the password reset link."
        })
      }


      const user = await User.findOne({
        where: { email: email}
      })

      if(!user) {
        return res.status(400).json({
          success: false,
          message: "email is not correct or invalid email."
        })
      }

      const passwordResetToken = crypto.randomBytes(20).toString("hex");
      const resetPasswordTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1hr

      user.resetPasswordToken = passwordResetToken;
      user.resetPasswordTokenExpireAt = resetPasswordTokenExpireAt;

      await user.save();

      await sendPasswordResetLink(user.email, `http://localhost:5173/reset-pasword/${passwordResetToken}`);

      res.status(200).json({
        success: true,
        message: "password reset link send successfully."
      })


    } catch (error) {
      res.status(500).json({
        success: false,
        message: error || "server error something went wrong."
      })

      console.log(`error while sending password reset link : ${error}`);
      
    }
}

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const {resetPasswordToken} = req.params;

    const user = await User.findOne({
      where: {resetPasswordToken: resetPasswordToken}
    })

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or token are expire."
      })
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.resetPasswordTokenExpireAt = null;

    await user.save();

   const emailResponse = await sendPasswordSuccessEmail(user.email);

   res.status(200).json({
    success: true,
    message: "Password reset sucessfully please check your email",
    emailResponse: emailResponse.response
   })
    

  } catch (error) {
    console.log(`error while sending success email reset password: ${error}`);
    res.status(500).json({
      success: false,
      message: `server error : something went wrong : ${error}`
    })
    
  }
}

   export const deletedUser = await User.destroy({where: {id: req.user}});
        if(!deletedUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete account or user unauthorized"
      })
    }

      res.clearCookie("authjwttoken");

   res.status(200).json({
    success: true,
    message: "Your account deleted successfully."
   })
    
  } catch (error) {
    console.log(`error while deleting account: ${error}`);
    res.status(500).json({
      success: false,
      message: `server error : something went wrong ${error}`
    })
  }
}


