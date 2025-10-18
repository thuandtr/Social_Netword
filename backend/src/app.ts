import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import appRouter from './routers';

const app = express();

// Middleware
/*
 * This middleware is responsible for parsing incoming request bodies: details <backend\md\explain1.md>
*/ 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/v1/auth", appRouter);

export default app;
