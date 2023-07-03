import { IncomingForm } from 'formidable';
// you might want to use regular 'fs' and not a promise one
import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_DIR = './public/uploads';

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const getFilePath = (uploadedFile) => {
  const tempPath = uploadedFile.filepath;

  const fileExt = path.extname(uploadedFile.originalFilename);
  const _filename = uploadedFile.originalFilename
    .replace(fileExt, '')
    .toLowerCase()
    .split(' ')
    .join('-');
  const fileName = _filename + fileExt;
  const destPath = path.join(UPLOAD_DIR, fileName);
  return [tempPath, destPath, fileName];
};

const getFile = (data) => {
  // read file from the temporary path
  // const contents = await fs.readFile(data?.files?.image[0].filepath, {
  //   encoding: 'utf8',
  // });

  // file = name should match with client append key name
  const uploadedFile = data?.files?.file[0];
  // console.log(data.files.image[0].filepath)
  // lastModifiedDate: 2023-07-03T14:59:31.191Z,
  // filepath: '/var/folders/79/y_xlt7h93cjg7tphn08tz2cw0000gn/T/b5ee8850d98c2c94ee44a7a07',
  // newFilename: 'b5ee8850d98c2c94ee44a7a07',
  // originalFilename: 'Screenshot 2023-07-03 at 10.28.00 AM.png',
  // mimetype: 'image/png',
  // hashAlgorithm: false,
  // size: 1058906,
  return uploadedFile;
};

const validateFileExt = (uploadedFile) => {
  const ext = path.extname(uploadedFile.originalFilename);
  if (!['.jpeg', '.jpg', '.png'].includes(ext)) {
    return false;
  }
  return true;
};

export default async (req, res) => {
  // parse form with a Promise wrapper
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const uploadedFile = getFile(data);
  if (!uploadedFile) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const validation = validateFileExt(uploadedFile);
  if (!validation) {
    res.status(400).end('This file format is allowed!');
    return;
  }

  try {
    const [tempPath, destPath, fileName] = getFilePath(uploadedFile);
    await fs.rename(tempPath, destPath); // Move file to ./public/uploads

    res.status(200).json({
      success: true,
      filename: fileName,
      type: 'photo',
    });
  } catch (error) {
    console.error('Error storing file:', error);
    res.status(500).json({ error: 'Error storing file' });
  }
};
