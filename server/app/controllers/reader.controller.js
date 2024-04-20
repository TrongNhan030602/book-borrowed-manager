const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save new Book
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not empty"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.create(req.body);
    return res.send(document);
  } catch (err) {
    return next(new ApiError(500, "An error occurred while creating reader"));
  }
};

// Retrieve (truy suất) all Books of a reader from database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const readerService = new ReaderService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await readerService.findByName(name);
    } else {
      documents = await readerService.find({});
    }
  } catch (err) {
    return next(new ApiError(500, "An error occurred while retrieving Books"));
  }

  return res.send(documents);
};

// Find a single Book with an id
exports.findOne = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found!"));
    }
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, `An error retrieving Book with id=${req.params.id}`)
    );
  }
};

// Update a Book by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.update(req.params.id, req.body);
    if (document === null) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `An error updating reader with id=${req.params.id}`)
    );
  }
};

// Delete a Book with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.delete(req.params.id);
    if (document === null) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `Could not delete Book with id=${req.params.id}`)
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const deleteCount = await readerService.deleteAll();
    return res.send({
      message: `${deleteCount} readers were deleted successfully!`,
    });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all readers")
    );
  }
};
