import { GridFSBucket } from 'mongodb';
import { connectToDatabase } from '../../lib/mongodbController'; // Ensure this path is correct
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });
    let client;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: 'Error parsing form' });
      }

      // Log the files object to verify its structure
      console.log("Parsed files object:", files);

      // Ensure the files object is correctly structured
      if (!files || !files.file || !files.file.length) {
        console.error("No files found in the request");
        return res.status(400).json({ error: 'No files found in the request' });
      }

      const file = files.file[0];

      try {
        const { db, client: connectedClient } = await connectToDatabase();
        client = connectedClient;

        const bucket = new GridFSBucket(db);
        const uploadStream = bucket.openUploadStream(file.originalFilename, {
          metadata: { contentType: file.mimetype },
        });

        const readStream = fs.createReadStream(file.filepath);
        readStream.pipe(uploadStream);

        uploadStream.on('finish', () => {
          console.log("File upload completed:", file.originalFilename);
          res.status(200).json({ message: 'File uploaded successfully', fileId: uploadStream.id });
     
        });

        uploadStream.on('error', (error) => {
          console.error("Error during upload:", error);
          res.status(500).json({ error: 'Failed to upload image' });
   
        });
      } catch (error) {
        console.error("Unexpected error during upload:", error);
        res.status(500).json({ error: 'Failed to upload image' });
      
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}