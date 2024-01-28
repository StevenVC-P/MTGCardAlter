const express = require("express");
const router = express.Router();
const { STORAGE_BUCKET } = require("../../env/config").env;
const { Storage } = require("@google-cloud/storage");

const keyFilename = '../gcp-service-account-key.json';
const storage = new Storage({ keyFilename });
const bucket = storage.bucket(STORAGE_BUCKET);

function generateUniqueFilename(userId) {
  const timestamp = Date.now(); // Current time in milliseconds
  const randomString = Math.random().toString(36).substring(2, 15); // A random string

  return `user-${userId}-${timestamp}-${randomString}.png`;
}
async function uploadImageToGCS(base64ImageData, userId) {
  // Convert base64 to buffer, removing the Data URL part if present
  const base64Data = base64ImageData.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  const filename = generateUniqueFilename(userId); 

  // Create a blob in the bucket and upload the file data
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        // Make the image public in the bucket (if it should be publicly accessible)
        await blob.makePublic();

        resolve(publicUrl);
      })
      .on("error", (err) => {
        reject(`Unable to upload image, something went wrong: ${err}`);
      })
      .end(imageBuffer);
  });
}

async function deleteImagesFromGCS(filenames) {
    const deletePromises = filenames.map((filename) => {
        const file = bucket.file(filename);
        return file.delete();
    });

    await Promise.all(deletePromises).catch((error) => {
        console.error("Error deleting files:", error);
    });
}

module.exports = {
  router,
  uploadImageToGCS,
  deleteImagesFromGCS,
};