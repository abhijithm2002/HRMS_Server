import "dotenv/config";
import express from "express";
import { userRoutes } from "./src/routes/userRoute.js";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

app.use(express.json());
const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    await connectDB();
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
