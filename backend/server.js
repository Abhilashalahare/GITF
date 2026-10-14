import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import contactRoutes from './routes/contactRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { connectDB } from './config/db.js';
import websiteMediaRoutes from './routes/websiteMediaRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

/*
 * --------------------------------------------------
 * CORS CONFIGURATION
 * --------------------------------------------------
 */
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


// production
// const allowedOrigins = [
//   process.env.FRONTEND_URL,
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       /*
//        * Allow requests that don't have an origin.
//        * Useful for Postman/server-to-server requests.
//        */
//       if (!origin) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(
//         new Error('Not allowed by CORS')
//       );
//     },

//     /*
//      * Required for HTTP-only cookies.
//      */
//     credentials: true,

//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

//     allowedHeaders: [
//       'Content-Type',
//       'Authorization',
//     ],
//   })
// );


/*
 * --------------------------------------------------
 * BODY PARSERS
 * --------------------------------------------------
 */

app.use(express.json({ limit: '1mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
);

/*
 * --------------------------------------------------
 * COOKIE PARSER
 * --------------------------------------------------
 */

app.use(cookieParser());

/*
 * --------------------------------------------------
 * ROUTES
 * --------------------------------------------------
 */

app.use('/api/contact', contactRoutes);

app.use('/api/gallery', galleryRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/website-media', websiteMediaRoutes);

/*
 * --------------------------------------------------
 * HEALTH CHECK
 * --------------------------------------------------
 */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GITF API is running',
  });
});

/*
 * --------------------------------------------------
 * 404 HANDLER
 * --------------------------------------------------
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

/*
 * --------------------------------------------------
 * GLOBAL ERROR HANDLER
 * --------------------------------------------------
 */

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  /*
   * CORS error
   */
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Request blocked by CORS policy',
    });
  }

  /*
   * Multer file-size error
   */
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File size exceeds the allowed limit.',
    });
  }

  /*
   * Multer file-count error
   */
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded.',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

/*
 * --------------------------------------------------
 * SERVER START
 * --------------------------------------------------
 */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Failed to start server:',
      error
    );

    process.exit(1);
  }
};

startServer();

export default app;