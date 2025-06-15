import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";


 const User = sequelize.define("User", {

    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    resetPasswordToken: DataTypes.STRING,

    resetPasswordTokenExpireAt: DataTypes.DATE,

     verificationToken: DataTypes.STRING,

     verificationTokenExpireAt: DataTypes.DATE,

}, { timestamps: true })



export default User;