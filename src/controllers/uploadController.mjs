import Upload from "../mongoose/schemas/upload.mjs";

export const getAllFiles = async (request, response) => {
  try {
    const allUploads = await Upload.find();

    response.status(200).send(allUploads);
  } catch (err) {
    response.send(`${err}`);
  }
};

export const approveFileById = async (request, response) => {
  const { id } = request.params;

  try {
    const file = await Upload.findById(id);
    if (!file) return response.status(404).send("File not found");

    file.approved = true;
    file.save();

    response.status(201).send("File aprroved successlly");
  } catch (err) {
    return response.status(201).send(`${err}`);
  }
};

export const disapproveFileById = async (request, response) => {
  const { id } = request.params;

  try {
    const file = await Upload.findByIdAndDelete(id);
    if (!file) return response.status(404).send("File not found");

    response.status(201).send("File disapproved successlly");
  } catch (err) {
    return response.status(201).send(`${err}`);
  }
};

export const deleteFileById = async (request, response) => {
  const { id } = request.params;

  try {
    const file = await Upload.findByIdAndDelete(id);

    if (!file) return response.status(404).send("File not found");

    response.status(201).send("File deleted successlly");
  } catch (err) {
    return response.status(500).send(`${err}`);
  }
};
