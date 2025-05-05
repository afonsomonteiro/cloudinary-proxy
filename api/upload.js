import cloudinary from 'cloudinary';
import { buffer } from 'micro';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const json = JSON.parse(rawBody.toString());
    const base64Image = `data:image/png;base64,${json.base64}`;

    cloudinary.v2.uploader.upload(base64Image, { folder: 'uploads' }, (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(200).json({ url: result.secure_url });
      }
    });
  } catch (err) {
    console.error('General Error:', err);
    res.status(500).json({ message: 'A server error has occurred', details: err.message });
  }
};
