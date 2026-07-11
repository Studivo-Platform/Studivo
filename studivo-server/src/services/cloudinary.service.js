const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

const uploadImage = async (file, options = {}) => {
  let fileSource;
  if (file.path) {
    fileSource = file.path;
  } else if (file.buffer) {
    fileSource = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  } else {
    throw new Error("Invalid file upload");
  }

  const result = await cloudinary.uploader.upload(fileSource, options);

  if (file.path && fs.existsSync(file.path)) {
    try {
      fs.unlinkSync(file.path);
    } catch (e) {}
  }

  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
};

const uploadImages = async (files, options = {}) => {
  const uploads = files.map((file) => uploadImage(file, options));

  return Promise.all(uploads);
};

const deleteImage = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = {
    uploadImage,
    uploadImages,
    deleteImage,
};
