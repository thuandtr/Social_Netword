import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import appRouter from './routers';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

// Middleware
/*
 * This middleware is responsible for parsing incoming request bodies: details <backend\md\explain1.md>
*/ 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS Configuration - Allow frontend to communicate with backend
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        process.env.FRONTEND_URL : 
        ['http://localhost:3000', 'http://localhost:3001'], // Allow both Next.js ports
    credentials: true, // Allow cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'] // Expose Set-Cookie header to client
}));

// Security Middleware
/*
 * Helmet helps secure Express apps by setting various HTTP headers: details <backend\md\explain2.md>
*/
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded cross-origin
}));

// Logging Middleware
/*
 * Morgan is an HTTP request logger middleware for Node.js: details <backend\md\explain3.md>
*/
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log("Request Received:", req.method, req.url);
    console.log("Request URL:", req.baseUrl + req.url);
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", JSON.stringify(req.body));
    console.log("Request Cookies:", JSON.stringify(req.cookies));
    next();
})

app.use("/api/v1/auth", appRouter);

// Serve uploaded files statically
// This exposes files stored under the "uploads" directory at /uploads/*
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));


// @ts-ignore
app.use((err, req, res, next) => {
    return res.status(500).json({ error: err.message, message: "Internal Server Error" });
})

export default app;
