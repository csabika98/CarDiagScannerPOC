import { GridFSBucket, ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodbController';

export default async function handler(req, res) {
  connectToDatabase().then(async (connection) => {
   let db = connection.db;

  try {
    
    const { id } = req.query;

    if (!ObjectId.isValid(String(id))) {
      console.error("Invalid ObjectId:", id);
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

   

    const bucket = new GridFSBucket(db);
    const objectId = new ObjectId(String(id));

    const files = await bucket.find({ _id: objectId }).toArray();

    if (!files || files.length === 0) {
      console.error("File not found:", objectId);
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];
    console.log("File metadata:", file);

    // Set headers for file download
    res.setHeader('Content-Type', file.metadata?.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

    // Create a stream to download the file
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('end', () => {
      console.log("File download completed:", objectId);
      res.end();
    });

    downloadStream.on('error', (error) => {
      console.error("Error streaming file:", error);
      res.status(500).json({ error: 'Error while retrieving the file' });
    });


  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: 'Failed to retrieve image' });
    
  }
}
    );
    }


