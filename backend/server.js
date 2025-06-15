import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db.js";

import authRoute from "./routes/auth.route.js";
import pokemonRoute from "./routes/pokemon.route.js"


dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.use("/api/v1/auth", authRoute); 
app.use("/api/v2/pokemon-api", pokemonRoute);


app.listen(PORT, () => {
    console.log(`server is running at port -> http://localhost:${PORT}`);
    connectToDatabase();    
})