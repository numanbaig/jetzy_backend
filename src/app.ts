import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())





// routes import
import { API_VERSION_PREFIX } from './utils/constants.ts';
import companyRouter from './routes/company.routes.ts';
import employeeRouter from './routes/employee.routes.ts';
import userRouter from './routes/user.routes.ts';



// routes declaration
app.use(`${API_VERSION_PREFIX}/user`, userRouter);
app.use(`${API_VERSION_PREFIX}/company`, companyRouter);
app.use(`${API_VERSION_PREFIX}/employee`, employeeRouter);



export default app;

// http://localhost:8000/api/v1/users/register
