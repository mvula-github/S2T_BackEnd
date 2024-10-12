import Upload from "../mongoose/schemas/upload.mjs";

export const getAllFiles = async (request, response) => {
  try {
    const allUploads = await Upload.find();

    response.status(200).send(allUploads);
  } catch (err) {
    response.send(`${err}`);
  }
};
