// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import crypto from 'crypto';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Website Media upload directory
// const uploadRoot = path.resolve(
//   __dirname,
//   '../uploads/website-media'
// );

// // Temporary directory for uploads
// const tempRoot = path.resolve(
//   __dirname,
//   '../uploads/temp-website-media'
// );

// fs.mkdirSync(uploadRoot, { recursive: true });
// fs.mkdirSync(tempRoot, { recursive: true });

// // Save uploaded files temporarily.
// // The final destination is chosen after Multer parses the form.
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempRoot);
//   },

//   filename: (req, file, cb) => {
//     const extension = path.extname(file.originalname).toLowerCase();

//     const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

//     cb(null, uniqueName);
//   },
// });

// // Supported formats
// const allowedMimeTypes = new Set([
//   'image/jpeg',
//   'image/png',
//   'image/webp',
//   'video/mp4',
//   'video/quicktime',
//   'video/webm',
// ]);

// const fileFilter = (req, file, cb) => {
//   if (!allowedMimeTypes.has(file.mimetype)) {
//     return cb(
//       new Error(
//         'Only JPG, PNG, WebP, MP4, MOV and WebM files are allowed.'
//       )
//     );
//   }

//   cb(null, true);
// };

// // Upload one file, up to 100 MB
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 100 * 1024 * 1024,
//     files: 1,
//   },
// });

// // Validate the placement key and move the file to its final directory.
// export const websiteMediaUploadMiddleware = {
//   single(fieldName) {
//     const multerSingle = upload.single(fieldName);

//     return (req, res, next) => {
//       multerSingle(req, res, async (uploadError) => {
//         if (uploadError) {
//           return next(uploadError);
//         }

//         // Validate the key after Multer has parsed the form.
//         const placementKey = req.body?.placementKey || req.body?.key;

//         if (
//           typeof placementKey !== 'string' ||
//           !/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(placementKey)
//         ) {
//           // Remove the temporary file if the key is invalid.
//           if (req.file?.path) {
//             try {
//               await fs.promises.unlink(req.file.path);
//             } catch (error) {
//               console.error(
//                 'Unable to remove temporary upload:',
//                 error.message
//               );
//             }
//           }

//           return res.status(400).json({
//             success: false,
//             message:
//               'Invalid placement key. Use a format such as home/intro.',
//           });
//         }

//         if (!req.file) {
//           return next();
//         }

//         try {
//           // home/intro becomes uploads/website-media/home/intro/
//           const parts = placementKey.split('/');

//           const destination = path.resolve(uploadRoot, ...parts);

//           // Prevent directory traversal.
//           if (!destination.startsWith(uploadRoot + path.sep)) {
//             await fs.promises.unlink(req.file.path).catch(() => {});

//             return res.status(400).json({
//               success: false,
//               message: 'Invalid upload directory.',
//             });
//           }

//           await fs.promises.mkdir(destination, { recursive: true });

//           const finalPath = path.join(
//             destination,
//             req.file.filename
//           );

//           await fs.promises.rename(req.file.path, finalPath);

//           // Update the file path for the controller.
//           req.file.path = finalPath;
//           req.file.destination = destination;

//           next();
//         } catch (error) {
//           if (req.file?.path) {
//             await fs.promises.unlink(req.file.path).catch(() => {});
//           }

//           next(error);
//         }
//       });
//     };
//   },
// };


import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoot = path.resolve(
  __dirname,
  '../uploads/website-media'
);

const tempRoot = path.resolve(
  __dirname,
  '../uploads/temp-website-media'
);

fs.mkdirSync(uploadRoot, { recursive: true });
fs.mkdirSync(tempRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempRoot);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new Error(
        'Only JPG, PNG, WebP, MP4, MOV and WebM files are allowed.'
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1,
  },
});

const validPlacementKey = (key) => {
  return (
    typeof key === 'string' &&
    /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(key)
  );
};

export const websiteMediaUploadMiddleware = {
  single(fieldName) {
    const multerSingle = upload.single(fieldName);

    return (req, res, next) => {
      multerSingle(req, res, async (uploadError) => {
        if (uploadError) {
          return next(uploadError);
        }

        if (!req.file) {
          return next();
        }

        const placementKey =
          req.body?.key || req.body?.placementKey;

        if (!validPlacementKey(placementKey)) {
          await fs.promises
            .unlink(req.file.path)
            .catch(() => {});

          return res.status(400).json({
            success: false,
            message:
              'Invalid placement key. Use a format such as about/intro-1.',
          });
        }

        const parts = placementKey.split('/');
        const destination = path.resolve(uploadRoot, ...parts);

        if (!destination.startsWith(uploadRoot + path.sep)) {
          await fs.promises
            .unlink(req.file.path)
            .catch(() => {});

          return res.status(400).json({
            success: false,
            message: 'Invalid upload directory.',
          });
        }

        const tempPath = req.file.path;

        try {
          await fs.promises.mkdir(destination, {
            recursive: true,
          });

          const finalPath = path.join(
            destination,
            req.file.filename
          );

          await fs.promises.rename(tempPath, finalPath);

          // Update Multer's file information after the move succeeds.
          req.file.path = finalPath;
          req.file.destination = destination;
          req.file.filename = path.basename(finalPath);

          next();
        } catch (error) {
          await fs.promises
            .unlink(tempPath)
            .catch(() => {});

          next(error);
        }
      });
    };
  },
};
