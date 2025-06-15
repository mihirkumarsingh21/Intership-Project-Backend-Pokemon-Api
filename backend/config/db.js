import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT     

    }
)

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        .then(() => console.log(`Database connected successfuly.! `));

        await sequelize.sync()
        .then(() => console.log(`Tables synced successfully.`))

    } catch (err) {
        console.log(`Failed to connect to database or syncing: ${err}`);
    }
}

