import path from 'path';
import multer from 'multer';
import { unlink } from 'fs';
import { createRouter } from 'next-connect';

const router = createRouter();

const UPLOAD_DIR = './public/uploads';

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname
      .replace(fileExt, '')
      .toLowerCase()
      .split(' ')
      .join('-');
    cb(null, fileName + fileExt);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!['.jpeg', '.jpg', '.png'].includes(ext)) {
      return cb(res.status(400).end('Only jpg, jpeg, png is allowed'), false);
    }
    cb(null, true);
  },
});

var uploadSingle = multer({ storage: storage }).single('file');

router.post((req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) return res.json({ success: false, err });

    if (res.req.file) {
      return res.json({
        success: true,
        filename: res.req.file.filename,
        type: 'photo',
      });
    } else {
      return res.json({ success: false, err: { message: 'file not found!' } });
    }
  });
});

router.delete(async (req, res) => {
  const { file } = req.query;
  if (file) {
    unlink(`${UPLOAD_DIR}/${file}`, (err) => {
      if (err) return res.status(200).json({ err });
      return res
        .status(200)
        .json({ message: 'file deleted', filename: file, success: true });
    });
  } else {
    res.status(200).json({
      message: 'Can not deleted unknown file. File name required!',
      success: false,
    });
  }
});

// Required!
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

// We can use multer as a middleware as well
// apiRoute.use(upload.array('file')); // attribute name you are sending the file by
// apiRoute.post((req, res) => {
//   res.status(200).json({ data: `/uploads/${filename}` }); // response
// });

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    // res.status(err.statusCode || 500).end(err.message);
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});
