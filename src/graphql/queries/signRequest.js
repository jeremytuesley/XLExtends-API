const cloudinary = require('cloudinary').v2;

const signRequest = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARY_SECRET);

  return { authToken: signature };
};

module.exports = { signRequest };
