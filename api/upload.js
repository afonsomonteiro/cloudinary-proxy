import cloudinary from 'cloudinary';
import { buffer } from 'micro';

cloudinary.v2.config({
  cloud_name: 'dupa7ageq',
  api_key: '989374222891284',
  api_secret: 'NMeoiUIF-H6egDnl7iTKOXC_5bc'
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const rawBody = await buffer(req);
  const json = JSON.parse(rawBody.toString());
  const base64Image = `data:image/png;base64,${json.base64}`;

  cloudinary.v2.uploader.upload(base64Image, { folder: 'uploads' }, (error, result) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ url: result.secure_url });
    }
  });
};
