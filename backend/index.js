import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnection from "./midleware/database.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import massageRouter from "./routes/massageRouter.js";

dotenv.config({});
let app = express();

// midelwares
let corsOption = {
  origin: process.env.FRONTEND_PORT,
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(corsOption));

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/massage", massageRouter);

app.listen(process.env.PORT, () => {
  dbConnection();
  console.log(`SERVER STARTED AT PORT ${process.env.PORT}`);
});
