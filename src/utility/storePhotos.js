import { createReadStream } from 'fs'
import path from 'path'
import { createModel } from 'mongoose-gridfs'

function saveFileToDb(filename) {
  return new Promise((resolve, reject) => {
    const Attachment = createModel();
    const readStream = createReadStream(path.join(__dirname, `../../data/photos/${filename}.jpeg`));
    const options = ({ filename, contentType: 'image/jpeg' });
    Attachment.write(options, readStream, (error, file) => {
      resolve(file)
    });
  })

}

export { saveFileToDb }