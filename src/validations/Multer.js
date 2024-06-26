// const multer = require('multer');

// const allowedExt = [
//     'image/jpg', 
//     'image/jpeg', 
//     'image/png',
//     'application/zip',
//     'application/x-zip-compressed',
//     'application/x-compressed',
//     'application/pdf'
// ];

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public');
//     },

//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const fileName = uniqueSuffix + '.png';

//         if (req.body) {
//             if (Array.isArray(req.body.image)) {
//                 req.body.image.push(fileName);
//                 cb(null, fileName);
//             } else if (file.fieldname == 'image[]') {
//                 req.body.image = [fileName];
//                 cb(null, fileName);
//             } else if (file.fieldname == 'header_picture') {
//                 req.body.header_picture = fileName;
//                 cb(null, fileName);
//             } else if (file.fieldname == 'profile_picture') {
//                 req.body.profile_picture = fileName;
//                 cb(null, fileName);
//             } else if (file.fieldname == 'file') {
//                 req.body.file = fileName.replace('.png', '.zip');
//                 cb(null, fileName.replace('.png', '.zip'));
//             } else if (file.fieldname == 'identity_card') {
//                 req.body.identity_card = fileName;
//                 cb(null, fileName);
//             } else if (file.fieldname == 'curriculum_vitae') {
//                 req.body.curriculum_vitae = fileName.replace('.png', '.pdf');
//                 cb(null, fileName.replace('.png', '.pdf'));
//             }
//         }
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (allowedExt.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

// const MulterUpload = multer({
//     storage: fileStorage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 50000000
//     }
// });

// module.exports = MulterUpload;

const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const env = require("../config/env.config");

const storage = new Storage({
  projectId: env("PROJECT_ID"),
  keyFilename: 'keyfile.json',
});

const bucket = storage.bucket(env("BUCKET_NAME"));

const fileStorage = multer.memoryStorage();

const MulterUpload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 50000000,
    },
});

const uploadHandler = (req, files) => {
  files.map((file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + '-' + file.originalname;

    req.body.filename = fileName;

    uploadFileToBucket(file, fileName)
  })
}

const uploadFileToBucket = (file, filename) => {
  try {
    return new Promise((resolve, reject) => {
      const blob = bucket.file(filename);
  
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
  
      blobStream.on('error', (error) => {
        reject(error);
      });
  
      blobStream.on('finish', () => {
        resolve();
      });
  
      blobStream.end(file.buffer);
    });
    
  } catch (error) {
    
  }
};

module.exports = { MulterUpload, uploadHandler };