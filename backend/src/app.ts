import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import appRouter from './routers';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
/*
 * This middleware is responsible for parsing incoming request bodies: details <backend\md\explain1.md>
*/ 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));

// Security Middleware
/*
 * Helmet helps secure Express apps by setting various HTTP headers: details <backend\md\explain2.md>
*/
app.use(helmet());

// Logging Middleware
/*
 * Morgan is an HTTP request logger middleware for Node.js: details <backend\md\explain3.md>
*/
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log("Request Received:", req.method, req.url);
    console.log("Request URL:", req.baseUrl + req.url);
    console.log("Request Headers:", req.headers);
    console.log(JSON.stringify(req.cookies));
    next();
})

app.use("/api/v1/auth", appRouter);

export default app;
